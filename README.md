# GTA Landing

Landing site and AI assistant for **Global Turbine Asia Sdn Bhd (GTA)** — aerospace MRO services.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Tech Stack

| Layer        | Technology |
|-------------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI**        | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org) |
| **Styling**   | [Tailwind CSS 4](https://tailwindcss.com), [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) |
| **Backend / DB** | [Supabase](https://supabase.com) (Postgres, RPC for RAG, chat history) |
| **Animations** | [Framer Motion](https://www.framer.com/motion) |
| **UI primitives** | [Radix UI](https://www.radix-ui.com) (Slot), [Lucide React](https://lucide.dev) |
| **Markdown**  | [react-markdown](https://github.com/remarkjs/react-markdown), [remark-gfm](https://github.com/remarkjs/remark-gfm), [remark-breaks](https://github.com/remarkjs/remark-breaks) |
| **Utilities** | [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge) |

---

## AI Stack

The in-app **GTA Assist** chat is powered by the [Vercel AI SDK](https://sdk.vercel.ai) with configurable providers and RAG.

### LLM providers (configurable)

One provider is active at a time; see `app/api/chat/route.ts` → `PROVIDER_CONFIG.active`.

| Provider   | SDK / client | Default model | Env var |
|-----------|--------------|----------------|---------|
| **Google Gemini** | `@ai-sdk/google` | `gemini-2.0-flash` | `GOOGLE_GENERATIVE_AI_API_KEY` |
| **OpenRouter**    | `@ai-sdk/openai` (base URL `https://openrouter.ai/api/v1`) | `z-ai/glm-4.5-air:free` | `OPENROUTER_API_KEY` |

- **Streaming:** `streamText()` from the `ai` package.
- **System prompt:** “GTA Assist” — professional guide for GTA aerospace MRO (SBH®, AOG, GSP®, Training). Defined in `app/lib/prompt.ts`.

### Embeddings & RAG

| Service    | Use | Model / config |
|------------|-----|----------------|
| **Jina AI** | Query and document embeddings for RAG | [Jina Embeddings API](https://jina.ai/embeddings/) — `jina-embeddings-v4`, 1024 dimensions |

- User messages are embedded with Jina; Supabase RPC `match_documents` runs semantic search over stored document embeddings.
- Retrieved context is passed into the LLM for grounded, company-specific answers.

### Summary

- **LLM:** Vercel AI SDK → Gemini **or** OpenRouter (one active).
- **Embeddings:** Jina AI (`jina-embeddings-v4`, 1024d).
- **RAG:** Supabase Postgres + `match_documents` RPC.
- **Chat history:** Stored in Supabase; configurable in `app/api/chat/route.ts` (`HISTORY_CONFIG`).

---

## Environment variables

Create a `.env.local` (or set in your host) with:

```bash
# Supabase (required for DB, RAG, chat history)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# LLM — use the one that matches PROVIDER_CONFIG.active in app/api/chat/route.ts
GOOGLE_GENERATIVE_AI_API_KEY=...   # when using provider "gemini"
OPENROUTER_API_KEY=...             # when using provider "openrouter"

# Embeddings (required for RAG)
JINA_API_KEY=...
```

---

## Getting started

1. Install dependencies:

```bash
npm install
# or: yarn | pnpm | bun
```

2. Add the environment variables above to `.env.local`.

3. Run the dev server:

```bash
npm run dev
# or: yarn dev | pnpm dev | bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Edit the landing page in `app/page.tsx`; the chat API lives under `app/api/chat/`.

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Supabase Docs](https://supabase.com/docs)
- [Deploy on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
