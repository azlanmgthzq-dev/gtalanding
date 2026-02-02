-- =============================================================================
-- CHAT HISTORY TABLE SETUP
-- =============================================================================
-- Run this in Supabase SQL Editor

-- 1. Create the chat_history table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for fast session lookups
CREATE INDEX idx_chat_history_session ON chat_history (session_id, created_at DESC);

-- 3. Create function to get last N messages for a session
CREATE OR REPLACE FUNCTION get_chat_history(
  p_session_id UUID,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ch.id,
    ch.role,
    ch.content,
    ch.created_at
  FROM chat_history ch
  WHERE ch.session_id = p_session_id
  ORDER BY ch.created_at DESC
  LIMIT p_limit;
END;
$$;

-- 4. Optional: Create function to clear old sessions (cleanup)
CREATE OR REPLACE FUNCTION cleanup_old_chat_history(
  days_old INT DEFAULT 7
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM chat_history
  WHERE created_at < NOW() - (days_old || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- 5. Verify setup
SELECT 'chat_history table created successfully' AS status;
