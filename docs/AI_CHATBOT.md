# GTA AI Chatbot - Developer Documentation

> Complete technical documentation for the RAG-based AI chatbot system.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [File Structure](#file-structure)
6. [API Reference](#api-reference)
7. [Components](#components)
8. [Configuration](#configuration)
9. [System Prompt](#system-prompt)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The GTA AI Chatbot is a **Retrieval-Augmented Generation (RAG)** system that provides intelligent responses about Global Turbine Asia's services. It uses:

- **Vector embeddings** (Jina AI) for semantic search
- **Supabase pgvector** for document storage and similarity search
- **OpenRouter/Gemini** for LLM responses
- **Real-time streaming** for responsive UX

### Key Features

- ✅ Real streaming responses (not simulated)
- ✅ RAG-based context retrieval
- ✅ **Chat History** - AI remembers conversation context
- ✅ Markdown rendering with links, lists, headings
- ✅ Glassmorphic dark UI design
- ✅ Switchable LLM providers (OpenRouter / Gemini)

> 📖 **See also:** [Chat History Documentation](./CHAT_HISTORY.md)

### IMPORTANT INSTALLTION
1. npm install framer-motion luicide react
2. npx shadcn@latest add https://21st.dev/r/aghasisahakyan1/ai-input
3. npm install tw-animate-css
4. supabase pass - > Pojekmegat#
4. npm install @supabase/supabase-js ai @ai-sdk/openai
5. npm install @ai-sdk/react
6. npm install @ai-sdk/google
7. npm install ai
8. npm install react-markdown
9. npm install -D @tailwindcss/typography
10. npm install remark-gfm
11. npm install remark-breaks
12. npm install remark-gfm
---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                            │
│  ┌─────────────────┐    ┌─────────────────────────────────────────┐ │
│  │  ChatTrigger    │───▶│  ChatBox (Streaming UI)                 │ │
│  │  (Ask AI btn)   │    │  - ReactMarkdown + remark-gfm           │ │
│  └─────────────────┘    │  - Real-time message streaming          │ │
│                         └─────────────────────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────┘
                                     │ POST /api/chat
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Next.js)                         │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  /api/chat/route.ts                                             ││
│  │  1. Extract user query                                          ││
│  │  2. Generate embedding (Jina AI)                                ││
│  │  3. Vector search (Supabase pgvector)                           ││
│  │  4. Build context from matched documents                        ││
│  │  5. Stream LLM response (OpenRouter/Gemini)                     ││
│  └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────┬────────────────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│   JINA AI API    │    │   SUPABASE (pgvector)│    │   LLM PROVIDER   │
│                  │    │                      │    │                  │
│  Embeddings      │    │  documents table     │    │  OpenRouter      │
│  1024 dimensions │    │  - content           │    │  - GLM-4.5-Air   │
│                  │    │  - metadata          │    │                  │
│                  │    │  - embedding         │    │  OR Gemini       │
│                  │    │  - match_documents() │    │  - gemini-2.0    │
└──────────────────┘    └──────────────────────┘    └──────────────────┘
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# =============================================================================
# SUPABASE - Vector Database
# =============================================================================
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Optional: For client-side access (not currently used)
SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_xxx"

# =============================================================================
# JINA AI - Embeddings
# =============================================================================
# Get from: https://jina.ai/embeddings/
JINA_API_KEY="jina_xxx"

# =============================================================================
# LLM PROVIDERS (at least one required)
# =============================================================================

# OpenRouter - Recommended (many free models available)
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY="sk-or-v1-xxx"

# Google Gemini - Alternative
# Get from: https://aistudio.google.com/apikey
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSyxxx"
```

### Getting API Keys

| Service | URL | Notes |
|---------|-----|-------|
| Supabase | [supabase.com](https://supabase.com) | Free tier available. Use Service Role key for server-side. |
| Jina AI | [jina.ai](https://jina.ai/embeddings/) | Free tier: 1M tokens/month |
| OpenRouter | [openrouter.ai](https://openrouter.ai/keys) | Many free models available |
| Google AI | [aistudio.google.com](https://aistudio.google.com/apikey) | Free tier available |

---

## Database Setup

### 1. Enable pgvector Extension

In Supabase SQL Editor:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Create Documents Table

```sql
CREATE TABLE documents (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1024),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 3. Create Similarity Search Function

```sql
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1024),
  match_threshold FLOAT DEFAULT 0.35,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 4. Verify Setup

```sql
-- Check if table exists
SELECT * FROM documents LIMIT 1;

-- Check function exists
SELECT proname FROM pg_proc WHERE proname = 'match_documents';
```

---

## File Structure

```
gtalanding/
├── .env.local                    # Environment variables (DO NOT COMMIT)
├── lib/
│   ├── supabase.ts              # Supabase client initialization
│   ├── jina.ts                  # Jina AI embedding function
│   └── prompt.ts                # System prompt template
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts         # Main chat API (streaming)
│   │   └── ingest/
│   │       └── route.ts         # Document ingestion API (DEV ONLY)
│   ├── admin/
│   │   └── page.tsx             # Document ingestion UI (DEV ONLY)
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatBox.tsx      # Main chat interface
│   │   │   └── ChatTrigger.tsx  # "Ask AI" button/input
│   │   └── sections/
│   │       └── ChatHero.tsx     # Hero section with embedded chat
│   └── globals.css              # Global styles including chat-markdown
└── docs/
    ├── AI_CHATBOT.md            # This documentation
    ├── CHAT_HISTORY.md          # Chat history feature docs
    ├── DEV_DOCUMENT_INGESTION.md # Ingestion tool docs
    └── sql/
        └── chat_history_setup.sql # SQL for chat history table
```

---

## API Reference

### POST /api/chat

Main chat endpoint. Streams LLM response.

**Request:**
```typescript
{
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>
}
```

**Response:** `text/plain` stream (tokens streamed as they generate)

**Flow:**
1. Extract last user message
2. Generate 1024-dim embedding via Jina AI
3. Search Supabase for similar documents (threshold: 0.35)
4. Build context from top 5 matches
5. Generate system prompt with context
6. Stream LLM response

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What services does GTA offer?"}],"sessionId":"optional-uuid"}'
```

> 💡 Include `sessionId` to enable chat history persistence. See [Chat History docs](./CHAT_HISTORY.md).

---

### POST /api/ingest *(DEV ONLY)*

Ingest a document with auto-generated embedding.

**Request:**
```typescript
{
  content: string;           // Required: document text
  metadata?: {
    category?: string;       // e.g., "services", "about"
    file_name?: string;      // e.g., "overview.pdf"
    [key: string]: any;
  }
}
```

**Response:**
```typescript
{
  success: boolean;
  id: number;               // Supabase document ID
  message: string;
}
```

---

### GET /api/ingest *(DEV ONLY)*

List all documents.

**Response:**
```typescript
{
  documents: Array<{
    id: number;
    content: string;
    metadata: object;
    created_at: string;
  }>
}
```

---

### DELETE /api/ingest?id=X *(DEV ONLY)*

Delete a document by ID.

---

## Components

### ChatBox

Main chat interface component.

**Props:**
```typescript
interface ChatBoxProps {
  onClose: () => void;        // Called when X button clicked
  initialQuery?: string;      // Auto-send this message on mount
  sessionId?: string;         // Optional: continue existing session
}
```

**Features:**
- Real streaming (ReadableStream API)
- Auto-scroll to bottom
- Markdown rendering with:
  - `remark-breaks` - Single line breaks → `<br>`
  - `remark-gfm` - GitHub Flavored Markdown (auto-links, tables)
- Custom link component (opens in new tab)
- Loading states and error handling

**Usage:**
```tsx
<ChatBox
  onClose={() => setShowChat(false)}
  initialQuery="What is GTA?"
/>
```

**Features:**
- Session-based chat history (persists to Supabase)
- "New Chat" button to start fresh conversation
- Loads previous messages on mount

---

### ChatTrigger (MorphPanel)

Animated "Ask AI" button that expands into an input field.

**Props:**
```typescript
interface MorphPanelProps {
  onSubmit?: (value: string) => void;  // Called with input text
}
```

**Features:**
- Animated morph from button to input
- Enter key to submit
- Escape key to close
- Animated color orb

---

## Configuration

### Switching LLM Providers

Edit `app/api/chat/route.ts`:

```typescript
const PROVIDER_CONFIG = {
  active: 'openrouter' as 'gemini' | 'openrouter',  // ← Change this

  gemini: {
    model: 'gemini-2.0-flash',
    temperature: 0.2,
  },

  openrouter: {
    model: 'z-ai/glm-4.5-air:free',  // Free model
    temperature: 0.4,
  },
};
```

### Available OpenRouter Models (Free)

| Model ID | Notes |
|----------|-------|
| `z-ai/glm-4.5-air:free` | Current default, good quality |
| `google/gemma-2-9b-it:free` | Google's open model |
| `meta-llama/llama-3.1-8b-instruct:free` | Meta's Llama 3.1 |
| `mistralai/mistral-7b-instruct:free` | Mistral 7B |

See full list: [openrouter.ai/models](https://openrouter.ai/models?q=free)

### Adjusting RAG Parameters

In `app/api/chat/route.ts`:

```typescript
const { data: documents } = await supabase.rpc('match_documents', {
  query_embedding: embedding,
  match_threshold: 0.35,  // Lower = more results, less relevant
  match_count: 5,         // Number of documents to retrieve
});
```

---

## System Prompt

The system prompt is defined in `lib/prompt.ts`. Key sections:

| Section | Purpose |
|---------|---------|
| ROLE | Defines the assistant's identity |
| OUTPUT FORMAT RULE | Markdown formatting instructions |
| IDENTITY & COMMUNICATION STYLE | Tone and behavior guidelines |
| CORE SERVICE KNOWLEDGE | Built-in knowledge about GTA services |
| GUARDRAILS | Prohibited topics and safe refusal |
| Context | Injected RAG documents |

### Modifying the Prompt

Edit `lib/prompt.ts`:

```typescript
export const generateSystemPrompt = (context: string) => `
SYSTEM PROMPT — YOUR COMPANY ASSISTANT

ROLE
You are "Assistant Name", the AI for Your Company...

...

Context:
${context}
`;
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Missing JINA_API_KEY" | Env var not set | Add to `.env.local` |
| "Missing Supabase variables" | Env vars not set | Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` |
| 404 from Gemini | Wrong model ID | Use `gemini-2.0-flash` not `models/gemini-2.0-flash` |
| No documents found | Low similarity threshold | Lower `match_threshold` to 0.2 |
| Walls of text | LLM ignoring formatting | Increase temperature or try different model |
| Links not rendering | Missing plugin | Ensure `remark-gfm` is installed |

### Debug Logging

The chat API logs extensively. Check terminal output:

```
============================================================
[Chat API] Request received at 2026-02-01T15:00:00.000Z
[Chat API] Provider: openrouter
[Chat API] Model: z-ai/glm-4.5-air:free
[Chat API] Received 3 messages
[Chat API] User query: What services does GTA offer?
[Chat API] Embedding generated, length: 1024
[Chat API] Found 4 relevant documents
[Chat API] System prompt length: 5234
[Chat API] Returning text stream response
```

### Testing Endpoints

```bash
# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Test embedding (via ingest)
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"content":"Test document","metadata":{"category":"test"}}'

# List documents
curl http://localhost:3000/api/ingest
```

---

## Dependencies

### Required npm packages

```json
{
  "ai": "^4.x",
  "@ai-sdk/google": "^1.x",
  "@ai-sdk/openai": "^1.x",
  "@supabase/supabase-js": "^2.x",
  "react-markdown": "^9.x",
  "remark-breaks": "^4.x",
  "remark-gfm": "^4.x"
}
```

### Install all

```bash
npm install ai @ai-sdk/google @ai-sdk/openai @supabase/supabase-js react-markdown remark-breaks remark-gfm
```

---

## Security Notes

1. **Never commit `.env.local`** - Contains API keys
2. **Use Service Role key server-side only** - Has full database access
3. **Links open in new tab** with `rel="noopener noreferrer"` - Prevents tab-nabbing
4. **System prompt has guardrails** - Prevents sensitive data disclosure

---

## Cleanup (Post-Production)

Once documents are ingested, delete dev-only files:

```powershell
# Delete ingestion tools
Remove-Item -Recurse -Force "app/admin"
Remove-Item -Recurse -Force "app/api/ingest"
Remove-Item "docs/DEV_DOCUMENT_INGESTION.md"
```

**Keep these files:**
- `app/api/chat/route.ts`
- `lib/supabase.ts`
- `lib/jina.ts`
- `lib/prompt.ts`
- `app/components/chat/*`

---

*Last updated: 2026-02-01*
