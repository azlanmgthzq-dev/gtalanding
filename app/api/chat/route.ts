import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { supabase } from '@/lib/supabase';
import { getJinaEmbedding } from '@/lib/jina';
import { generateSystemPrompt } from '@/lib/prompt';

// =============================================================================
// PROVIDER CONFIGURATION - Change this to switch between providers
// =============================================================================
const PROVIDER_CONFIG = {
    active: 'openrouter' as 'gemini' | 'openrouter',

    gemini: {
        model: 'gemini-2.0-flash',
        temperature: 0.2,
    },

    openrouter: {
        model: 'z-ai/glm-4.5-air:free',
        temperature: 0.4,
    },
} as const;

// =============================================================================
// CHAT HISTORY CONFIGURATION
// =============================================================================
const HISTORY_CONFIG = {
    enabled: true,           // Toggle chat history feature
    maxMessages: 10,         // Number of past messages to include as context
};

// Initialize providers
const geminiProvider = google;
const openrouterBase = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
        'HTTP-Referer': 'https://gtalanding.com',
        'X-Title': 'GTA Landing',
    },
});
const openrouterProvider = openrouterBase.chat;

// Select active provider and model
const activeProvider = PROVIDER_CONFIG.active === 'gemini' ? geminiProvider : openrouterProvider;
const activeModel = PROVIDER_CONFIG.active === 'gemini'
    ? PROVIDER_CONFIG.gemini.model
    : PROVIDER_CONFIG.openrouter.model;
const activeTemperature = PROVIDER_CONFIG.active === 'gemini'
    ? PROVIDER_CONFIG.gemini.temperature
    : PROVIDER_CONFIG.openrouter.temperature;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * Save a message to chat history
 */
async function saveToHistory(sessionId: string, role: 'user' | 'assistant', content: string) {
    if (!HISTORY_CONFIG.enabled) return;

    const { error } = await supabase
        .from('chat_history')
        .insert({
            session_id: sessionId,
            role,
            content,
        });

    if (error) {
        console.error('[Chat History] Failed to save message:', error);
    } else {
        console.log('[Chat History] Saved', role, 'message');
    }
}

/**
 * Fetch chat history for a session
 */
async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    if (!HISTORY_CONFIG.enabled) return [];

    const { data, error } = await supabase
        .from('chat_history')
        .select('role, content, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(HISTORY_CONFIG.maxMessages);

    if (error) {
        console.error('[Chat History] Failed to fetch history:', error);
        return [];
    }

    // Reverse to get chronological order (oldest first)
    const messages = (data || []).reverse().map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
    }));

    console.log('[Chat History] Loaded', messages.length, 'messages from history');
    return messages;
}

// =============================================================================
// MAIN API HANDLER
// =============================================================================

export async function POST(req: Request) {
    console.log('='.repeat(60));
    console.log('[Chat API] Request received at', new Date().toISOString());
    console.log('[Chat API] Provider:', PROVIDER_CONFIG.active);
    console.log('[Chat API] Model:', activeModel);

    try {
        const { messages, sessionId } = await req.json();
        console.log('[Chat API] Received', messages.length, 'messages');
        console.log('[Chat API] Session ID:', sessionId || 'none (history disabled)');

        const lastMessage = messages[messages.length - 1];

        // 1. Extract user query
        const userQuery = typeof lastMessage.content === 'string'
            ? lastMessage.content
            : lastMessage.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n');

        console.log('[Chat API] User query:', userQuery?.substring(0, 100));

        // 2. Save user message to history (if session provided)
        if (sessionId && HISTORY_CONFIG.enabled) {
            await saveToHistory(sessionId, 'user', userQuery);
        }

        // 3. Fetch chat history for context
        let historyMessages: ChatMessage[] = [];
        if (sessionId && HISTORY_CONFIG.enabled) {
            historyMessages = await getChatHistory(sessionId);
            // Remove the last message since it's the current one we just saved
            if (historyMessages.length > 0 && historyMessages[historyMessages.length - 1].content === userQuery) {
                historyMessages = historyMessages.slice(0, -1);
            }
        }

        // 4. Embedding & Vector Search (RAG)
        const embedding = await getJinaEmbedding(userQuery);
        console.log('[Chat API] Embedding generated, length:', embedding?.length);

        const { data: documents, error: supabaseError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.35,
            match_count: 5,
        });

        if (supabaseError) {
            console.error('[Chat API] Supabase RAG error:', supabaseError);
        }
        console.log('[Chat API] Found', documents?.length || 0, 'relevant documents');

        // 5. Build context from RAG documents
        const ragContext = documents
            ?.map((doc: any) => `[Doc: ${doc.metadata?.file_name || 'GTA Knowledge'}]: ${doc.content}`)
            .join('\n\n');
        const systemPrompt = generateSystemPrompt(ragContext || '');
        console.log('[Chat API] System prompt length:', systemPrompt.length);

        // 6. Combine history + current messages
        // Priority: history messages first, then current request messages
        const currentMessages = messages.map((m: any) => ({
            role: m.role,
            content: typeof m.content === 'string'
                ? m.content
                : Array.isArray(m.parts)
                    ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('\n')
                    : String(m.content || '')
        }));

        // Merge: history (excluding current) + current messages
        const allMessages = [...historyMessages, ...currentMessages];

        // Deduplicate if there's overlap (keep last occurrence)
        const seenContents = new Set<string>();
        const deduplicatedMessages = allMessages.reverse().filter(m => {
            const key = `${m.role}:${m.content}`;
            if (seenContents.has(key)) return false;
            seenContents.add(key);
            return true;
        }).reverse();

        console.log('[Chat API] Total messages for LLM:', deduplicatedMessages.length);

        // 7. Stream response
        console.log('[Chat API] Calling streamText...');
        const result = await streamText({
            model: activeProvider(activeModel),
            messages: [
                { role: 'system', content: systemPrompt },
                ...deduplicatedMessages
            ],
            temperature: activeTemperature,
            // Callback to save assistant response after streaming completes
            onFinish: async ({ text }) => {
                if (sessionId && HISTORY_CONFIG.enabled && text) {
                    await saveToHistory(sessionId, 'assistant', text);
                    console.log('[Chat API] Assistant response saved to history');
                }
            },
        });

        console.log('[Chat API] Returning text stream response');
        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error('[Chat API] ERROR:', error);
        console.error('[Chat API] Error message:', error?.message);
        return new Response(JSON.stringify({
            error: error?.message || 'Unknown error',
            name: error?.name,
            details: error?.cause || error?.data
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// =============================================================================
// GET - Fetch chat history for a session
// =============================================================================

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'sessionId is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { data, error } = await supabase
            .from('chat_history')
            .select('id, role, content, created_at')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        return new Response(JSON.stringify({ messages: data }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error?.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}