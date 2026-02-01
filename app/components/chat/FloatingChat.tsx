"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatTrigger from "./ChatTrigger";
import ChatBox from "./ChatBox";

const SESSION_STORAGE_KEY = "gta-chat-session-id";

/**
 * FloatingChat - Uses ChatTrigger and ChatBox
 * - If user has existing conversation → clicking Ask AI opens ChatBox directly
 * - If no history → ChatTrigger expands to input mode as normal
 */
export default function FloatingChat() {
    const [showChat, setShowChat] = useState(false);
    const [initialQuery, setInitialQuery] = useState("");
    const [hasHistory, setHasHistory] = useState(false);

    // Check if user has existing conversation history on mount
    useEffect(() => {
        async function checkForHistory() {
            try {
                const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

                if (!sessionId) {
                    setHasHistory(false);
                    return;
                }

                // Check if there are messages in this session
                const response = await fetch(`/api/chat?sessionId=${sessionId}`);
                if (response.ok) {
                    const data = await response.json();
                    setHasHistory(data.messages && data.messages.length > 0);
                }
            } catch (error) {
                console.error("Error checking chat history:", error);
                setHasHistory(false);
            }
        }

        checkForHistory();
    }, []);

    const handleTriggerSubmit = (query: string) => {
        setInitialQuery(query);
        setShowChat(true);
    };

    // Called when user clicks the button (before expanding to input)
    const handleTriggerClick = () => {
        if (hasHistory) {
            // Has history - open ChatBox directly
            setInitialQuery("");
            setShowChat(true);
            return true; // Signal to ChatTrigger: don't expand, we're handling it
        }
        return false; // No history - let ChatTrigger expand normally
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setInitialQuery("");
        // After chatting, assume there's now history
        setHasHistory(true);
    };

    return (
        <>
            {/* Floating ChatTrigger - Bottom right */}
            <AnimatePresence>
                {!showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <ChatTrigger
                            onSubmit={handleTriggerSubmit}
                            onClick={handleTriggerClick}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ChatBox - Bottom right when open */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-48px)]"
                    >
                        <ChatBox
                            onClose={handleCloseChat}
                            initialQuery={initialQuery}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
