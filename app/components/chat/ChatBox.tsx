"use client";

import { motion } from "framer-motion";
import { Send, User, X, Loader2, History, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, FormEvent, useCallback, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

// =============================================================================
// SECURITY CONSTANTS
// =============================================================================
const MAX_INPUT_LENGTH = 2000;
const MIN_INPUT_LENGTH = 1;

/**
 * Client-side input sanitization
 */
function sanitizeClientInput(input: string): string {
    return input
        .trim()
        .replace(/\0/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/ {3,}/g, '  ');
}

// =============================================================================
// TYPES
// =============================================================================
interface ChatBoxProps {
    onClose: () => void;
    initialQuery?: string;
    sessionId?: string;  // Optional: pass existing session to continue
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================
const SESSION_STORAGE_KEY = "gta-chat-session-id";

/**
 * Generate a new UUID for session
 */
function generateSessionId(): string {
    return crypto.randomUUID();
}

/**
 * Get or create session ID (persisted in sessionStorage for browser tab)
 */
function getOrCreateSessionId(): string {
    if (typeof window === "undefined") return generateSessionId();

    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
}

/**
 * Clear session (for "New Chat" feature)
 */
function clearSession(): string {
    const newSessionId = generateSessionId();
    if (typeof window !== "undefined") {
        sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    }
    return newSessionId;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const WELCOME_MESSAGE: Message = {
    id: "welcome",
    role: "assistant",
    content: "Welcome to GTA. How can I assist you with our MRO services today?",
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ChatBox({ onClose, initialQuery = "", sessionId: propSessionId }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const hasAutoSent = useRef(false);
    const hasLoadedHistory = useRef(false);

    // =========================================================================
    // INITIALIZE SESSION
    // =========================================================================
    useEffect(() => {
        const id = propSessionId || getOrCreateSessionId();
        setSessionId(id);
        console.log("[ChatBox] Session ID:", id);
    }, [propSessionId]);

    // =========================================================================
    // LOAD CHAT HISTORY
    // =========================================================================
    useEffect(() => {
        if (!sessionId || hasLoadedHistory.current) return;

        async function loadHistory() {
            try {
                console.log("[ChatBox] Loading history for session:", sessionId);
                const response = await fetch(`/api/chat?sessionId=${sessionId}`);

                if (!response.ok) {
                    console.log("[ChatBox] No history found or error");
                    setIsLoadingHistory(false);
                    return;
                }

                const data = await response.json();

                if (data.messages && data.messages.length > 0) {
                    const historyMessages: Message[] = data.messages.map((m: any, index: number) => ({
                        id: m.id || `history-${index}`,
                        role: m.role as "user" | "assistant",
                        content: m.content,
                    }));

                    // Prepend welcome message, then history
                    setMessages([WELCOME_MESSAGE, ...historyMessages]);
                    console.log("[ChatBox] Loaded", historyMessages.length, "messages from history");
                }
            } catch (error) {
                console.error("[ChatBox] Failed to load history:", error);
            } finally {
                setIsLoadingHistory(false);
                hasLoadedHistory.current = true;
            }
        }

        loadHistory();
    }, [sessionId]);

    // =========================================================================
    // AUTO-SCROLL
    // =========================================================================
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // =========================================================================
    // STREAMING CHAT - Real streaming from API with session persistence
    // =========================================================================
    const sendMessage = useCallback(async (messageText: string) => {
        // Client-side validation
        const sanitized = sanitizeClientInput(messageText);

        if (sanitized.length < MIN_INPUT_LENGTH) return;
        if (isLoading) return;

        if (sanitized.length > MAX_INPUT_LENGTH) {
            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: `Message too long. Please keep your message under ${MAX_INPUT_LENGTH} characters.`,
            }]);
            return;
        }

        // 1. Add user message immediately
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: sanitized,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // 2. Create placeholder for assistant's streamed response
        const assistantId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

        try {
            // 3. Call the streaming API with session ID
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages.filter(m => m.id !== "welcome"), userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    sessionId, // Include session ID for history persistence
                }),
            });

            // Handle security/rate limit errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = "Sorry, I encountered an error. Please try again.";

                if (response.status === 429) {
                    errorMessage = `Too many requests. Please wait ${errorData.retryAfter || 60} seconds before trying again.`;
                } else if (response.status === 400) {
                    errorMessage = errorData.error || "Your message could not be processed. Please try rephrasing.";
                }

                setMessages(prev =>
                    prev.map(m => m.id === assistantId
                        ? { ...m, content: errorMessage }
                        : m
                    )
                );
                return;
            }

            // 4. Stream the response using ReadableStream
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let streamedContent = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    streamedContent += decoder.decode(value, { stream: true });

                    setMessages(prev =>
                        prev.map(m => m.id === assistantId
                            ? { ...m, content: streamedContent }
                            : m
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev =>
                prev.map(m => m.id === assistantId
                    ? { ...m, content: "Sorry, I encountered an error. Please try again." }
                    : m
                )
            );
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading, sessionId]);

    // =========================================================================
    // NEW CHAT - Clear history and start fresh
    // =========================================================================
    const startNewChat = useCallback(() => {
        const newSessionId = clearSession();
        setSessionId(newSessionId);
        setMessages([WELCOME_MESSAGE]);
        hasLoadedHistory.current = false;
        console.log("[ChatBox] Started new chat with session:", newSessionId);
    }, []);

    // =========================================================================
    // AUTO-SEND INITIAL QUERY
    // =========================================================================
    useEffect(() => {
        if (initialQuery && !hasAutoSent.current && !isLoadingHistory) {
            hasAutoSent.current = true;
            sendMessage(initialQuery);
        }
    }, [initialQuery, sendMessage, isLoadingHistory]);

    // =========================================================================
    // FORM HANDLER
    // =========================================================================
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // =========================================================================
    // RENDER
    // =========================================================================
    return (
        <div className="relative flex flex-col h-[600px] max-h-[80vh] w-full bg-slate-900/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Header */}
            <ChatHeader
                isLoading={isLoading}
                onClose={onClose}
                onNewChat={startNewChat}
                hasHistory={messages.length > 1}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scrollbar" ref={scrollRef}>
                {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-12 text-white/50">
                        <Loader2 size={24} className="animate-spin mr-2" />
                        <span>Loading conversation...</span>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} isTyping={isLoading && msg.content === ""} />
                        ))}
                    </>
                )}
            </div>

            {/* Input */}
            <ChatInput
                input={input}
                setInput={setInput}
                isLoading={isLoading || isLoadingHistory}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================
function ChatHeader({
    isLoading,
    onClose,
    onNewChat,
    hasHistory
}: {
    isLoading: boolean;
    onClose: () => void;
    onNewChat: () => void;
    hasHistory: boolean;
}) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-transparent shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-white/10 border border-white/20">
                    <Image
                        src="/Logo/GTALogoGen.jpeg"
                        alt="GTA"
                        width={38}
                        height={38}
                        className="rounded-full"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-white tracking-wide">GTA AI Assistant</h3>
                    <p className="text-xs text-blue-200/60">
                        {isLoading ? "Thinking..." : "Online • Ready to assist"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* New Chat Button */}
                {hasHistory && (
                    <button
                        onClick={onNewChat}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Start new conversation"
                    >
                        <History size={18} />
                    </button>
                )}
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}

function MessageBubble({ message, isTyping = false }: { message: Message; isTyping?: boolean }) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border overflow-hidden ${isUser
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/10 border-white/20"
                    }`}
            >
                {isUser ? (
                    <User size={16} />
                ) : (
                    <Image
                        src="/Logo/GTALogoGen.jpeg"
                        alt="GTA"
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                )}
            </div>

            {/* Message content */}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${isUser
                    ? "bg-blue-600/20 text-white border-blue-500/20"
                    : "bg-slate-800/60 text-slate-100 border-white/5"
                    }`}
            >
                {isUser ? (
                    message.content
                ) : isTyping && !message.content ? (
                    /* Animated typing dots */
                    <div className="flex items-center gap-1 py-1">
                        <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                ) : (
                    /* Markdown rendering */
                    <div className="chat-markdown prose prose-invert prose-sm max-w-none prose-p:my-3 prose-p:leading-relaxed prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-headings:my-4 prose-headings:font-semibold prose-h2:text-base prose-headings:text-white prose-strong:text-blue-300 prose-a:text-blue-400 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-300 prose-code:text-blue-300 prose-code:bg-slate-700/50 prose-code:px-1 prose-code:rounded [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                            remarkPlugins={[remarkBreaks, remarkGfm]}
                            components={{
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                                    >
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {message.content || "..."}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function ChatInput({
    input,
    setInput,
    isLoading,
    onSubmit,
}: {
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    onSubmit: (e: FormEvent) => void;
}) {
    return (
        <div className="p-6 border-t border-white/10 bg-transparent">
            <form onSubmit={onSubmit} className="relative group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about MRO services, certifications, or partnerships..."
                    disabled={isLoading}
                    className="w-full bg-slate-950/60 text-white placeholder-white/30 border border-white/20 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-light disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600/80 text-white rounded-lg hover:bg-blue-500 disabled:opacity-30 disabled:bg-slate-600 transition-all"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </form>
        </div>
    );
}