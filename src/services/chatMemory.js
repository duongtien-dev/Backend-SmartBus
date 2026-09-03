const sessions = new Map();

const MAX_RECENT_TURNS = 16;
const MAX_SUMMARY_CHARS = 3500;
const SESSION_TTL_MS = 6 * 60 * 60 * 1000;

function sessionKey(userId, conversationId) {
    return `${userId}:${conversationId}`;
}

function pruneExpired() {
    const now = Date.now();
    for (const [key, session] of sessions.entries()) {
        if (now - session.updatedAt > SESSION_TTL_MS) {
            sessions.delete(key);
        }
    }
}

function createConversationId() {
    return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateSession(userId, conversationId) {
    pruneExpired();
    const id = conversationId || createConversationId();
    const key = sessionKey(userId, id);
    let session = sessions.get(key);
    if (!session) {
        session = {
            conversationId: id,
            userId: String(userId),
            summary: '',
            turns: [],
            updatedAt: Date.now(),
        };
        sessions.set(key, session);
    } else {
        session.updatedAt = Date.now();
    }
    return session;
}

function compressIfNeeded(session) {
    if (session.turns.length <= MAX_RECENT_TURNS) return;

    const keep = 10;
    const oldTurns = session.turns.splice(0, session.turns.length - keep);
    const blob = oldTurns
        .map((turn) => `${turn.role === 'model' ? 'Assistant' : 'User'}: ${turn.text}`)
        .join('\n');
    const merged = [session.summary, blob].filter(Boolean).join('\n');
    session.summary = merged.slice(-MAX_SUMMARY_CHARS);
}

function appendTurn(session, role, text) {
    const cleaned = String(text || '').trim().slice(0, 2000);
    if (!cleaned) return;
    const last = session.turns[session.turns.length - 1];
    if (last && last.role === role && last.text === cleaned) return;
    session.turns.push({ role, text: cleaned, at: Date.now() });
    session.updatedAt = Date.now();
    compressIfNeeded(session);
}

function buildMemoryContext(session) {
    if (!session.summary) return '';
    return `Earlier conversation summary:\n${session.summary}`;
}

function toGeminiContents(session) {
    return session.turns.map((turn) => ({
        role: turn.role === 'model' ? 'model' : 'user',
        parts: [{ text: turn.text }],
    }));
}

function clearUserSessions(userId) {
    const prefix = `${userId}:`;
    for (const key of sessions.keys()) {
        if (key.startsWith(prefix)) sessions.delete(key);
    }
}

module.exports = {
    getOrCreateSession,
    appendTurn,
    buildMemoryContext,
    toGeminiContents,
    clearUserSessions,
    createConversationId,
};
