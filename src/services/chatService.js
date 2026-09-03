const { GoogleGenAI } = require('@google/genai');
const config = require('../config');
const { buildSystemInstruction, fallbackReply } = require('../knowledge/chatKnowledge');
const ticketProductService = require('./ticketProductService');

const MAX_HISTORY = 12;
const MAX_TOOL_ROUNDS = 4;

const SCREEN_ACTIONS = {
    home: { type: 'open_home' },
    tickets: { type: 'open_tickets' },
    payment: { type: 'open_payment' },
    my_tickets: { type: 'open_my_tickets' },
    language: { type: 'open_language' },
};

const FUNCTION_DECLARATIONS = [
    {
        name: 'list_ticket_products',
        description:
            'Get current DanaBus ticket types and prices. Call before answering about ticket prices or product names.',
        parametersJsonSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'suggest_app_screen',
        description:
            'Hand the user to an existing app screen instead of doing that task in chat. Use home for A-to-B trip search.',
        parametersJsonSchema: {
            type: 'object',
            properties: {
                screen: {
                    type: 'string',
                    enum: ['home', 'tickets', 'payment', 'my_tickets', 'language'],
                    description:
                        'home = trip search; tickets = buy ticket; payment = payment methods; my_tickets = QR tickets; language = app language',
                },
            },
            required: ['screen'],
        },
    },
];

function normalizeMessages(messages) {
    return messages
        .slice(-MAX_HISTORY)
        .map((item) => ({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(item.text || '').trim().slice(0, 2000) }],
        }))
        .filter((item) => item.parts[0].text);
}

function pushAction(actions, screen) {
    const action = SCREEN_ACTIONS[screen];
    if (!action) return;
    if (!actions.some((item) => item.type === action.type)) {
        actions.push(action);
    }
}

async function executeTool(name, args, actions) {
    if (name === 'list_ticket_products') {
        const products = await ticketProductService.listActiveProducts();
        return {
            products: products.map((product) => ({
                code: product.code,
                title: product.title,
                validity: product.validity,
                unitPrice: product.unitPrice,
            })),
        };
    }

    if (name === 'suggest_app_screen') {
        const screen = args?.screen;
        pushAction(actions, screen);
        return { ok: true, screen };
    }

    return { error: 'Unknown tool' };
}

function getClient() {
    if (!config.gemini.apiKey) {
        const error = new Error('Chưa cấu hình GEMINI_API_KEY trên server');
        error.status = 503;
        throw error;
    }
    return new GoogleGenAI({ apiKey: config.gemini.apiKey });
}

async function chat({ messages, locale = 'vi' }) {
    const contents = normalizeMessages(messages);
    if (!contents.length) {
        const error = new Error('Tin nhắn không hợp lệ');
        error.status = 400;
        throw error;
    }

    const ai = getClient();
    const actions = [];

    try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
            const response = await ai.models.generateContent({
                model: config.gemini.model,
                contents,
                config: {
                    systemInstruction: buildSystemInstruction(locale),
                    temperature: 0.3,
                    maxOutputTokens: 768,
                    thinkingConfig: { thinkingBudget: 0 },
                    automaticFunctionCalling: { disable: true },
                    tools: [{ functionDeclarations: FUNCTION_DECLARATIONS }],
                },
            });

            const calls = response.functionCalls || [];
            if (!calls.length) {
                const reply = (response.text || '').trim();
                if (!reply) {
                    return { reply: fallbackReply(locale), actions };
                }
                return { reply, actions };
            }

            const modelContent = response.candidates?.[0]?.content;
            if (modelContent) {
                contents.push(modelContent);
            }

            const parts = [];
            for (const call of calls) {
                const result = await executeTool(call.name, call.args || {}, actions);
                const functionResponse = {
                    name: call.name,
                    response: result,
                };
                if (call.id) functionResponse.id = call.id;
                parts.push({ functionResponse });
            }
            contents.push({ role: 'user', parts });
        }

        return { reply: fallbackReply(locale), actions };
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
