const axios = require('axios');
const DevicePushToken = require('../models/DevicePushToken');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const CHUNK_SIZE = 100;

function isExpoPushToken(token) {
    return (
        typeof token === 'string' &&
        (token.startsWith('ExponentPushToken[') ||
            token.startsWith('ExpoPushToken['))
    );
}

async function sendExpoMessages(messages) {
    if (!messages.length) {
        return { tickets: [], sent: 0 };
    }

    const tickets = [];
    for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
        const chunk = messages.slice(i, i + CHUNK_SIZE);
        const response = await axios.post(EXPO_PUSH_URL, chunk, {
            headers: {
                Accept: 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            timeout: 15000,
        });
        const data = response.data?.data;
        if (Array.isArray(data)) {
            tickets.push(...data);
        }
    }

    return { tickets, sent: messages.length };
}

/**
 * Gửi push tới mọi device active của user (Expo Push API).
 * Token FCM thô chưa hỗ trợ ở đây — ưu tiên ExponentPushToken.
 */
async function sendToUser(userId, { title, body, data = {} } = {}) {
    const devices = await DevicePushToken.find({
        userId,
        active: true,
    }).lean();

    const expoDevices = devices.filter((d) => isExpoPushToken(d.token));
    if (!expoDevices.length) {
        return { sent: 0, skipped: devices.length, reason: 'no_expo_token' };
    }

    const messages = expoDevices.map((device) => ({
        to: device.token,
        sound: 'default',
        title: title || 'DanaBus',
        body: body || '',
        data,
    }));

    const { tickets, sent } = await sendExpoMessages(messages);

    const invalidTokens = [];
    tickets.forEach((ticket, index) => {
        if (
            ticket?.status === 'error' &&
            (ticket.details?.error === 'DeviceNotRegistered' ||
                ticket.message?.includes('not a registered push'))
        ) {
            invalidTokens.push(expoDevices[index]?.token);
        }
    });

    if (invalidTokens.length) {
        await DevicePushToken.updateMany(
            { token: { $in: invalidTokens.filter(Boolean) } },
            { $set: { active: false } }
        );
    }

    return { sent, tickets, deactivated: invalidTokens.length };
}

module.exports = {
    isExpoPushToken,
    sendToUser,
    sendExpoMessages,
};
