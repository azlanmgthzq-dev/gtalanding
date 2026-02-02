# Document Ingestion Tool

> **⚠️ DEV FEATURE** - This is a temporary admin tool for populating the knowledge base. Delete after use.

## Overview

This tool allows you to manually add documents to the Supabase vector database. Each document is embedded using Jina AI (1024 dimensions) and stored for RAG-based chat retrieval.

---

## How to Use

### 1. Access the Admin Page

```
http://localhost:3000/admin
```

### 2. Add Documents

1. **Paste content** into the textarea (required)
2. **Add category** (optional) - helps organize docs (e.g., "services", "about", "certifications")
3. **Add source name** (optional) - track where the content came from (e.g., "company_brochure.pdf")
4. Click **"Ingest Document"**

### 3. Verify Storage

- Documents appear in the list below the form
- Each shows ID, category, source, and content preview
- Use the delete button (🗑️) if you made a mistake

---

## API Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ingest` | `{ content, metadata }` | Create document with embedding |
| `GET` | `/api/ingest` | - | List all documents (max 50) |
| `DELETE` | `/api/ingest?id=X` | - | Delete document by ID |

### Example POST Request

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "content": "GTA provides aircraft maintenance services...",
    "metadata": {
      "category": "services",
      "file_name": "overview.txt"
    }
  }'
```

---

## Database Schema

```sql
CREATE TABLE documents (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1024)
);

-- Required function for similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1024),
  match_threshold FLOAT,
  match_count INT
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

---

## 🧹 Cleanup Instructions

**When you're done ingesting all documents, delete these files:**

### Files to Delete

```
app/
├── admin/
│   └── page.tsx          ← DELETE this file (or entire folder)
└── api/
    └── ingest/
        └── route.ts      ← DELETE this file (or entire folder)
```

### Commands to Delete

```powershell
# Delete admin page
Remove-Item -Recurse -Force "app/admin"

# Delete ingest API
Remove-Item -Recurse -Force "app/api/ingest"

# Delete this documentation (optional)
Remove-Item "docs/DEV_DOCUMENT_INGESTION.md"
```

### What to KEEP

| File | Keep? | Reason |
|------|-------|--------|
| `app/api/chat/route.ts` | ✅ YES | Used by chatbot for queries |
| `lib/supabase.ts` | ✅ YES | Database client for chat |
| `lib/jina.ts` | ✅ YES | Embedding for chat queries |
| `lib/prompt.ts` | ✅ YES | System prompt for chat |
| Supabase `documents` table | ✅ YES | Your knowledge base data |

---

## Tips for Good Documents

1. **Chunk large documents** - Split into ~500-1000 character chunks for better retrieval
2. **Be specific** - Include context in each chunk (don't assume the reader knows the topic)
3. **Use categories** - Makes debugging easier ("why didn't it find X?" → check category)
4. **Avoid duplicates** - Same content = wasted embeddings

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing JINA_API_KEY" | Add `JINA_API_KEY=xxx` to `.env.local` |
| "Missing Supabase variables" | Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` |
| Embedding dimension mismatch | Ensure Jina uses 1024 dimensions (check `lib/jina.ts`) |
| Document not found in chat | Lower `match_threshold` in `app/api/chat/route.ts` (default: 0.35) |

---

*Last updated: 2026-02-01*
