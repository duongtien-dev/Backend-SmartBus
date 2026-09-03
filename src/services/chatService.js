const { GoogleGenAI } = require('@google/genai');
const config = require('../config');
const { buildSystemInstruction, fallbackReply } = require('../knowledge/chatKnowledge');
const {
    getOrCreateSession,
    appendTurn,
    buildMemoryContext,
    toGeminiContents,
} = require('./chatMemory');
const { FUNCTION_DECLARATIONS, executeTool } = require('./chatTools');

const MAX_TOOL_ROUNDS = 5;

function getClient() {
    if (!config.gemini.apiKey) {
        const error = new Error('Chưa cấu hình GEMINI_API_KEY trên server');
        error.status = 503;
        throw error;
    }
    return new GoogleGenAI({ apiKey: config.gemini.apiKey });
}

function extractLatestUserText(messages = []) {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
        const item = messages[i];
        if (item?.role === 'user' && item?.text) {
            return String(item.text).trim().slice(0, 2000);
        }
    }
    return '';
}

function syncSessionFromClient(session, messages = []) {
    if (session.turns.length) return;
    const history = messages
        .filter((item) => item?.text && (item.role === 'user' || item.role === 'model'))
        .slice(-12);
    if (history.length <= 1) return;
    const prior = history.slice(0, -1);
    for (const item of prior) {
        appendTurn(session, item.role === 'model' ? 'model' : 'user', item.text);
    }
}

async function chat({
    messages = [],
    locale = 'vi',
    userId,
    conversationId,
}) {
    const userText = extractLatestUserText(messages);
    if (!userText) {
        const error = new Error('Tin nhắn không hợp lệ');
        error.status = 400;
        throw error;
    }
    if (!userId) {
        const error = new Error('Cần đăng nhập để dùng chatbot');
        error.status = 401;
        throw error;
    }

    const session = getOrCreateSession(userId, conversationId);
    syncSessionFromClient(session, messages);
    appendTurn(session, 'user', userText);

    const memoryContext = buildMemoryContext(session);
    const contents = toGeminiContents(session);
    if (!contents.length) {
        contents.push({ role: 'user', parts: [{ text: userText }] });
    }

    const ai = getClient();
    const actions = [];

    try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
            const response = await ai.models.generateContent({
                model: config.gemini.model,
                contents,
                config: {
                    systemInstruction: buildSystemInstruction(locale, memoryContext),
                    temperature: 0.3,
                    maxOutputTokens: 900,
                    thinkingConfig: { thinkingBudget: 0 },
                    automaticFunctionCalling: { disable: true },
                    tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
                },
            });

            const calls = response.functionCalls || [];
            if (!calls.length) {
                const reply =
                    (response.text || '').trim() || fallbackReply(locale);
                appendTurn(session, 'model', reply);
                return {
                    reply,
                    actions,
                    conversationId: session.conversationId,
                };
            }

            const modelContent = response.candidates?.[0]?.content;
            if (modelContent) {
                contents.push(modelContent);
            }

            const parts = [];
            for (const call of calls) {
                const result = await executeTool(call.name, call.args || {}, {
                    userId,
                    actions,
                });
                const functionResponse = {
                    name: call.name,
                    response: result,
                };
                if (call.id) functionResponse.id = call.id;
                parts.push({ functionResponse });
            }
            contents.push({ role: 'user', parts });
        }

        const reply = fallbackReply(locale);
        appendTurn(session, 'model', reply);
        return {
            reply,
            actions,
            conversationId: session.conversationId,
        };
    } catch (error) {
        if (error.status) throw error;
        const wrapped = new Error(
            error.message || 'Không kết nối được trợ lý AI. Kiểm tra GEMINI_API_KEY.'
        );
        wrapped.status = error.status || 502;
        throw wrapped;
    }
}

module.exports = { chat };
