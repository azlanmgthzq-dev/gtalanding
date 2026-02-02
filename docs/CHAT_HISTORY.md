# Chat History Feature

> Session-based conversation persistence for the GTA AI Chatbot.

---

## Overview

The Chat History feature enables the AI to remember previous messages in a conversation. Users can now ask "What did I just ask about?" or "Summarize our conversation" and the AI will have context from earlier exchanges.

### Key Capabilities

- ✅ **Persistent conversations** - Messages saved to Supabase
- ✅ **Session management** - Unique session ID per browser tab
- ✅ **Conversation context** - Last 10 messages sent to AI for memory
- ✅ **Resume conversations** - Reload page and continue where you left off
- ✅ **New Chat button** - Start fresh conversation anytime
- ✅ **Automatic cleanup** - Optional function to purge old sessions

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (ChatBox.tsx)                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  1. Generate/retrieve session ID from sessionStorage            ││
│  │  2. On mount: Fetch existing history from /api/chat?sessionId=  ││
│  │  3. Display messages in UI                                      ││
│  │  4. Send new messages with sessionId in request body            ││
│  └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API (/api/chat/route.ts)                       │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  POST /api/chat:                                                ││
│  │    1. Save user message → chat_history                          ││
│  │    2. Fetch last 10 messages for context                        ││
│  │    3. Include history in LLM messages array                     ││
│  │    4. Stream response                                           ││
│  │    5. onFinish: Save assistant response → chat_history          ││
│  │                                                                 ││
│  │  GET /api/chat?sessionId=xxx:                                   ││
│  │    Return all messages for session (for UI reload)              ││
│  └─────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE (chat_history table)                    │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  id          │ UUID (primary key)                               ││
│  │  session_id  │ UUID (groups messages in a conversation)         ││
│  │  role        │ 'user' | 'assistant'                             ││
│  │  content     │ The message text                                 ││
│  │  created_at  │ Timestamp for ordering                           ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Setup

### 1. Run the SQL Setup Script

Execute `docs/sql/chat_history_setup.sql` in your Supabase SQL Editor:

```sql
-- Create table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_chat_history_session 
ON chat_history (session_id, created_at DESC);
```

### 2. Verify Setup

```sql
-- Test insert
INSERT INTO chat_history (session_id, role, content)
VALUES ('11111111-1111-1111-1111-111111111111', 'user', 'Test message');

-- Test query
SELECT * FROM chat_history WHERE session_id = '11111111-1111-1111-1111-111111111111';

-- Cleanup test
DELETE FROM chat_history WHERE session_id = '11111111-1111-1111-1111-111111111111';
```

---

## Configuration

### Toggle History Feature

In `app/api/chat/route.ts`:

```typescript
const HISTORY_CONFIG = {
    enabled: true,           // Set to false to disable persistence
    maxMessages: 10,         // Number of past messages as context
};
```

### Session Behavior

| Scenario | Behavior |
|----------|----------|
| **New tab** | New session ID generated |
| **Same tab, reload** | Same session ID, history loaded |
| **Close tab, reopen** | New session ID (sessionStorage cleared) |
| **Click "New Chat"** | New session ID, history cleared from UI |

---

## API Reference

### POST /api/chat

Main chat endpoint with history persistence.

**Request:**
```typescript
{
  messages: Array<{ role: string; content: string }>;
  sessionId?: string;  // Optional: for history persistence
}
```

**Behavior:**
1. If `sessionId` provided:
   - Save user message to `chat_history`
   - Load last 10 messages as context
   - After streaming, save assistant response
2. If no `sessionId`:
   - Works as before (no persistence)

---

### GET /api/chat?sessionId=xxx

Fetch all messages for a session (used by UI on mount).

**Response:**
```typescript
{
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }>
}
```

---

## Frontend Components

### ChatBox Props

```typescript
interface ChatBoxProps {
    onClose: () => void;
    initialQuery?: string;  // Auto-send on mount
    sessionId?: string;     // Optional: provide existing session
}
```

### Session Functions

```typescript
// Get or create session (auto-called by ChatBox)
function getOrCreateSessionId(): string

// Start new conversation (clears current session)
function clearSession(): string
```

---

## User Experience

### Conversation Continuity

```
User: "Tell me about GTA's turbine services"
AI: "GTA provides turbine engine MRO services including..."

User: "What did I just ask about?"
AI: "You asked about GTA's turbine services. I explained that..."

User: "Summarize our conversation so far"
AI: "In our conversation, you've asked about:
     1. Turbine services
     2. A request for summary..."
```

### New Chat Button

A **History icon** (↻) appears in the header after the first message. Clicking it:
1. Generates new session ID
2. Clears local message state
3. Resets to welcome message
4. History is preserved in DB (just not loaded)

---

## Data Retention & Cleanup

### Automatic Cleanup (Optional)

A SQL function is provided to clean up old sessions:

```sql
-- Delete sessions older than 7 days
SELECT cleanup_old_chat_history(7);
```

### Manual Cleanup

```sql
-- Delete all history for a specific session
DELETE FROM chat_history 
WHERE session_id = 'your-session-id';

-- Delete all history older than 30 days
DELETE FROM chat_history 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Storage Estimates

| Messages/Day | Storage/Month |
|--------------|---------------|
| 100 | ~10 MB |
| 1,000 | ~100 MB |
| 10,000 | ~1 GB |

Supabase free tier: 500 MB database storage.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| History not loading | Table doesn't exist | Run SQL setup script |
| Messages not saving | `enabled: false` in config | Set `enabled: true` |
| "What did I ask?" fails | Less than 2 messages in history | Need more conversation first |
| Session reset on reload | Using localStorage instead | Check it's `sessionStorage` |
| History loads wrong messages | Session ID mismatch | Clear sessionStorage, refresh |

### Debug Logging

Check server terminal for:

```
[Chat History] Saved user message
[Chat History] Loaded 5 messages from history
[Chat API] Total messages for LLM: 7
[Chat API] Assistant response saved to history
```

---

## Security Considerations

1. **Session IDs are UUIDs** - Not guessable
2. **No authentication** - Anyone with session ID can access history
3. **Server-side storage only** - Messages not in localStorage
4. **Cleanup recommended** - Implement retention policy

### For Production

Consider adding:
- User authentication (link sessions to users)
- Rate limiting on history endpoints
- Encryption at rest
- GDPR compliance (user data deletion)

---

## Files Modified

| File | Changes |
|------|---------|
| `app/api/chat/route.ts` | Added history save/load, GET endpoint |
| `app/components/chat/ChatBox.tsx` | Session management, history loading, new chat button |
| `docs/sql/chat_history_setup.sql` | New SQL setup script |
| `docs/CHAT_HISTORY.md` | This documentation |

---

*Last updated: 2026-02-01*
