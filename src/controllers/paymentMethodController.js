const paymentMethodService = require('../services/paymentMethodService');

async function createPaymentMethod(req, res) {
    try {
        const paymentMethod = await paymentMethodService.createPaymentMethod(req.user._id, req.body);
        res.status(201).json({ success: true, data: paymentMethod });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function updatePaymentMethod(req, res) {
    try {
        const { id, ...data } = req.body;
        const paymentMethod = await paymentMethodService.updatePaymentMethod(
            id,
            req.user._id,
            data
        );
        res.json({ success: true, data: paymentMethod });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

async function getMyPaymentMethods(req, res) {
    try {
        const paymentMethods = await paymentMethodService.getMyPaymentMethods(req.user._id);
        res.json({ success: true, data: paymentMethods });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function getPaymentMethodById(req, res) {
    try {
        const paymentMethod = await paymentMethodService.getPaymentMethodById(
            req.body.id,
            req.user._id
        );
        res.json({ success: true, data: paymentMethod });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
}

module.exports = {
    createPaymentMethod,
    updatePaymentMethod,
    getMyPaymentMethods,
    getPaymentMethodById,
};
