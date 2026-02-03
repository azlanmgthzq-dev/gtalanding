/**
 * Security utilities for the chatbot
 * Prevents XSS, injection attacks, and abuse
 */

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Trim whitespace
        .trim()
        // Remove null bytes
        .replace(/\0/g, '')
        // Limit consecutive newlines
        .replace(/\n{3,}/g, '\n\n')
        // Limit consecutive spaces
        .replace(/ {3,}/g, '  ')
        // Remove control characters (except newlines and tabs)
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Validate input length and content
 */
export function validateInput(input: string): { valid: boolean; error?: string } {
    const MAX_INPUT_LENGTH = 2000;
    const MIN_INPUT_LENGTH = 1;

    if (!input || typeof input !== 'string') {
        return { valid: false, error: 'Invalid input' };
    }

    const trimmed = input.trim();

    if (trimmed.length < MIN_INPUT_LENGTH) {
        return { valid: false, error: 'Message cannot be empty' };
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
        return { valid: false, error: `Message too long (max ${MAX_INPUT_LENGTH} characters)` };
    }

    return { valid: true };
}

// =============================================================================
// PROMPT INJECTION PROTECTION
// =============================================================================

// Patterns that might indicate prompt injection attempts
const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/i,
    /disregard\s+(all\s+)?(previous|prior|above)/i,
    /forget\s+(everything|all|your)\s+(instructions?|training|rules?)/i,
    /you\s+are\s+now\s+(a|an|the)/i,
    /pretend\s+(you\s+are|to\s+be)/i,
    /act\s+as\s+(if|a|an|the)/i,
    /new\s+instructions?:/i,
    /system\s*:\s*/i,
    /\[system\]/i,
    /\[INST\]/i,
    /<<SYS>>/i,
    /###\s*(instruction|system)/i,
    /jailbreak/i,
    /bypass\s+(your\s+)?(safety|restrictions?|filters?|rules?)/i,
    /override\s+(your\s+)?(safety|restrictions?|programming)/i,
];

/**
 * Check for potential prompt injection attempts
 */
export function detectPromptInjection(input: string): { safe: boolean; reason?: string } {
    const lowerInput = input.toLowerCase();

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(input)) {
            console.warn('[Security] Potential prompt injection detected:', pattern.toString());
            return {
                safe: false,
                reason: 'Your message contains patterns that are not allowed. Please rephrase your question.'
            };
        }
    }

    // Check for excessive special characters (potential code injection)
    const specialCharRatio = (input.match(/[<>{}[\]`\\|]/g) || []).length / input.length;
    if (specialCharRatio > 0.1) {
        return {
            safe: false,
            reason: 'Message contains too many special characters.'
        };
    }

    return { safe: true };
}

// =============================================================================
// RATE LIMITING (In-Memory for Edge/Serverless)
// =============================================================================

interface RateLimitEntry {
    count: number;
    firstRequest: number;
    lastRequest: number;
}

// In-memory store (resets on server restart - for production use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_CONFIG = {
    windowMs: 60 * 1000, // 1 minute window
    maxRequests: 20,     // Max 20 requests per window
    blockDurationMs: 5 * 60 * 1000, // 5 minute block if exceeded
};

/**
 * Check rate limit for an IP/session
 */
export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry) {
        // First request
        rateLimitStore.set(identifier, {
            count: 1,
            firstRequest: now,
            lastRequest: now,
        });
        return { allowed: true };
    }

    // Check if window has expired
    if (now - entry.firstRequest > RATE_LIMIT_CONFIG.windowMs) {
        // Reset the window
        rateLimitStore.set(identifier, {
            count: 1,
            firstRequest: now,
            lastRequest: now,
        });
        return { allowed: true };
    }

    // Check if blocked
    if (entry.count >= RATE_LIMIT_CONFIG.maxRequests) {
        const blockEnds = entry.lastRequest + RATE_LIMIT_CONFIG.blockDurationMs;
        if (now < blockEnds) {
            return {
                allowed: false,
                retryAfter: Math.ceil((blockEnds - now) / 1000)
            };
        }
        // Block expired, reset
        rateLimitStore.set(identifier, {
            count: 1,
            firstRequest: now,
            lastRequest: now,
        });
        return { allowed: true };
    }

    // Increment count
    entry.count++;
    entry.lastRequest = now;
    rateLimitStore.set(identifier, entry);

    return { allowed: true };
}

/**
 * Clean up old rate limit entries periodically
 */
export function cleanupRateLimits(): void {
    const now = Date.now();
    const maxAge = RATE_LIMIT_CONFIG.windowMs + RATE_LIMIT_CONFIG.blockDurationMs;

    for (const [key, entry] of rateLimitStore.entries()) {
        if (now - entry.lastRequest > maxAge) {
            rateLimitStore.delete(key);
        }
    }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

// =============================================================================
// CONTENT SECURITY
// =============================================================================

/**
 * Sanitize AI response before rendering
 * Removes potentially dangerous HTML/scripts that could slip through
 */
export function sanitizeAIResponse(response: string): string {
    if (!response || typeof response !== 'string') return '';

    return response
        // Remove script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove onclick and other event handlers
        .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: URLs
        .replace(/javascript:/gi, '')
        // Remove data: URLs (potential XSS)
        .replace(/data:(?!image\/(?:png|jpeg|gif|webp))/gi, '')
        // Remove style tags
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        // Remove iframe tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
}

// =============================================================================
// SESSION SECURITY
// =============================================================================

/**
 * Validate session ID format (UUID v4)
 */
export function isValidSessionId(sessionId: string): boolean {
    if (!sessionId || typeof sessionId !== 'string') return false;

    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(sessionId);
}

/**
 * Generate secure session ID
 */
export function generateSecureSessionId(): string {
    return crypto.randomUUID();
}

// =============================================================================
// REQUEST VALIDATION
// =============================================================================

/**
 * Validate chat request body
 */
export function validateChatRequest(body: any): {
    valid: boolean;
    error?: string;
    sanitizedMessages?: Array<{ role: string; content: string }>;
} {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' };
    }

    if (!Array.isArray(body.messages)) {
        return { valid: false, error: 'Messages must be an array' };
    }

    if (body.messages.length === 0) {
        return { valid: false, error: 'Messages array cannot be empty' };
    }

    if (body.messages.length > 50) {
        return { valid: false, error: 'Too many messages in request' };
    }

    // Validate and sanitize each message
    const sanitizedMessages = [];
    for (const msg of body.messages) {
        if (!msg || typeof msg !== 'object') {
            return { valid: false, error: 'Invalid message format' };
        }

        if (!['user', 'assistant', 'system'].includes(msg.role)) {
            return { valid: false, error: 'Invalid message role' };
        }

        if (typeof msg.content !== 'string') {
            return { valid: false, error: 'Message content must be a string' };
        }

        const inputValidation = validateInput(msg.content);
        if (!inputValidation.valid) {
            return { valid: false, error: inputValidation.error };
        }

        sanitizedMessages.push({
            role: msg.role,
            content: sanitizeInput(msg.content),
        });
    }

    // Validate sessionId if provided
    if (body.sessionId && !isValidSessionId(body.sessionId)) {
        return { valid: false, error: 'Invalid session ID format' };
    }

    return { valid: true, sanitizedMessages };
}