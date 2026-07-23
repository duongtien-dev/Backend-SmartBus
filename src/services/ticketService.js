const crypto = require('crypto');
const QRCode = require('qrcode');

const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const PaymentMethod = require('../models/PaymentMethod');
const ScanLog = require('../models/ScanLog');
const ticketProductService = require('./ticketProductService');

const VALID_VERIFY_STATUSES = new Set(['pending', 'paid', 'active']);
const MONTHLY_TYPES = new Set(['monthlySingleRoute', 'monthlyInterRoute']);

function computeExpectedPrice(product, seatQuantity) {
    if (product.code === 'single') {
        return product.unitPrice;
    }
    if (MONTHLY_TYPES.has(product.code)) {
        return product.unitPrice * Math.max(Number(seatQuantity) || 1, 1);
    }
    return product.unitPrice;
}

function generateQrCodeText() {
    return `TICKET-${crypto.randomUUID()}`;
}

function getInvalidReason(ticket) {
    if (!ticket) {
        return 'QR code không tồn tại';
    }

    if (ticket.status === 'cancelled') {
        return 'Vé đã bị hủy';
    }

    if (ticket.status === 'used') {
        return 'Vé đã được sử dụng';
    }

    if (ticket.status === 'expired') {
        return 'Vé đã hết hạn';
    }

    if (ticket.expiryDate && ticket.expiryDate.getTime() < Date.now()) {
        return 'Vé đã hết hạn';
    }

    if (!VALID_VERIFY_STATUSES.has(ticket.status)) {
        return `Vé không hợp lệ với trạng thái ${ticket.status}`;
    }

    return null;
}

function addMonthsPreserveDay(date, months) {
    const result = new Date(date.getTime());
    const day = result.getDate();

    result.setMonth(result.getMonth() + months);
    if (result.getDate() < day) {
        result.setDate(0);
    }

    return result;
}

function buildTicketDates(ticketType) {
    const issueDate = new Date();
    let expiryDate = null;

    if (ticketType === 'single') {
        expiryDate = new Date(issueDate.getTime());
        expiryDate.setDate(expiryDate.getDate() + 1);
    } else if (ticketType === 'monthlySingleRoute' || ticketType === 'monthlyInterRoute') {
        expiryDate = addMonthsPreserveDay(issueDate, 1);
    }

    return { issueDate, expiryDate };
}

async function createTicket(userId, data) {
    const route = await Route.findById(data.routeId).select('_id name code');
    if (!route) {
        throw new Error('Tuyến không tồn tại');
    }

    const paymentMethod = await PaymentMethod.findOne({
        _id: data.paymentMethodId,
        user: userId
    }).select('_id');
    if (!paymentMethod) {
        throw new Error('Phương thức thanh toán không tồn tại hoặc không thuộc về bạn');
    }

    const {
        routeId,
        startStopName,
        endStopName,
        ticketType,
        departureDate,
        departureTime,
        seatQuantity,
        customerName,
        customerPhone,
        paymentMethodId,
    } = data;

    const routeName =
        (route.name && String(route.name).trim()) ||
        (route.code ? `Tuyến ${route.code}` : 'Tuyến xe buýt');

    const product = await ticketProductService.getActiveProductByCode(ticketType);
    const price = computeExpectedPrice(product, seatQuantity);
    const normalizedDepartureTime =
        departureTime && String(departureTime).trim()
            ? String(departureTime).trim()
            : '00:00';

    const { issueDate, expiryDate } = buildTicketDates(ticketType);
    const purchaseDate = new Date();

    for (let attempt = 0; attempt < 3; attempt++) {
        const qrCode = generateQrCodeText();
        const qrCodeImage = await QRCode.toDataURL(qrCode, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            margin: 2,
            width: 320
        });

        try {
            const ticket = await Ticket.create({
                routeId,
                routeName,
                startStopName,
                endStopName,
                ticketType,
                departureDate,
                departureTime: normalizedDepartureTime,
                seatQuantity,
                customerName,
                customerPhone,
                paymentMethodId,
                price,
                user: userId,
                status: 'paid',
                purchaseDate,
                issueDate,
                expiryDate,
                qrCode,
                qrCodeImage
            });
            return ticket;
        } catch (error) {
            const isDuplicateQr = error?.code === 11000 && error?.keyPattern?.qrCode;
            if (!isDuplicateQr || attempt === 2) {
                throw error;
            }
        }
    }

    throw new Error('Không thể tạo vé');
}

async function verifyScannedQr(scannerUserId, data) {
    const qrCode = String(data.qrCode || '').trim();

    const ticket = await Ticket.findOne({ qrCode }).select(
        '_id user routeId routeName startStopName endStopName ticketType departureDate departureTime seatQuantity customerName customerPhone price status purchaseDate issueDate expiryDate usedAt qrCode'
    );

    const invalidReason = getInvalidReason(ticket);
    const isValid = !invalidReason;
    const reason = invalidReason || 'QR code hợp lệ';

    const scanLog = await ScanLog.create({
        ticket: ticket?._id || null,
        qrCode,
        isValid,
        reason,
        scannedBy: scannerUserId || null
    });

    return {
        isValid,
        reason,
        ticket,
        scanLogId: scanLog._id
    };
}

const TICKET_LIST_SELECT =
    '_id routeId routeName startStopName endStopName ticketType departureDate departureTime seatQuantity customerName customerPhone paymentMethodId price status purchaseDate issueDate expiryDate usedAt createdAt updatedAt';

const TICKET_QR_SELECT = ' qrCode qrCodeImage';

async function getMyTickets(userId, payload = {}) {
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const includeQr = Boolean(payload.includeQr);

    const filter = { user: userId };

    if (payload.status && ['pending', 'paid', 'active', 'used', 'expired', 'cancelled'].includes(payload.status)) {
        filter.status = payload.status;
    }

    if (
        payload.ticketType &&
        ['single', 'monthlySingleRoute', 'monthlyInterRoute'].includes(payload.ticketType)
    ) {
        filter.ticketType = payload.ticketType;
    }

    if (payload.onlyAvailableQr) {
        filter.status = { $in: ['pending', 'paid', 'active'] };
        filter.$or = [
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } }
        ];
    }

    const selectFields = includeQr
        ? `${TICKET_LIST_SELECT}${TICKET_QR_SELECT}`
        : TICKET_LIST_SELECT;

    const [items, total] = await Promise.all([
        Ticket.find(filter)
            .select(selectFields)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Ticket.countDocuments(filter)
    ]);

    return { items, page, limit, total };
}

function startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

async function getMyTripHistory(userId, payload = {}) {
    const page = Math.max(Number(payload.page) || 1, 1);
    const limit = Math.min(Math.max(Number(payload.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const today = startOfToday();

    const filter = {
        user: userId,
        status: { $ne: 'cancelled' },
        $or: [
            { status: 'used' },
            { status: 'expired' },
            { usedAt: { $ne: null } },
            {
                ticketType: 'single',
                departureDate: { $lt: today }
            },
            {
                ticketType: { $in: ['monthlySingleRoute', 'monthlyInterRoute'] },
                expiryDate: { $lt: new Date() }
            }
        ]
    };

    const [items, total] = await Promise.all([
        Ticket.find(filter)
            .select(TICKET_LIST_SELECT)
            .sort({ usedAt: -1, departureDate: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Ticket.countDocuments(filter)
    ]);

    return { items, page, limit, total };
}

async function getTicketById(ticketId, userId) {
    const ticket = await Ticket.findOne({
        _id: ticketId,
        user: userId
    })
        .populate('paymentMethodId', '-csc')
        .populate('routeId', 'name code');

    if (!ticket) {
        throw new Error('Vé không tồn tại hoặc không thuộc về bạn');
    }

    return ticket;
}

module.exports = {
    createTicket,
    verifyScannedQr,
    getMyTickets,
    getMyTripHistory,
    getTicketById
};
