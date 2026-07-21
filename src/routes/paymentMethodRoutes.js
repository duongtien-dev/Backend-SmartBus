const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const paymentMethodValidation = require('../validations/paymentMethodValidation');
const auth = require('../middlewares/auth');

router.use(auth);

router.post(
    '/create',
    paymentMethodValidation.createPaymentMethodRules,
    paymentMethodController.createPaymentMethod
);

router.post(
    '/update',
    ...paymentMethodValidation.idBodyRule,
    paymentMethodValidation.updatePaymentMethodRules,
    paymentMethodController.updatePaymentMethod
);

router.post(
    '/my-payment-methods',
    paymentMethodController.getMyPaymentMethods
);

router.post(
    '/detail',
    ...paymentMethodValidation.idBodyRule,
    paymentMethodController.getPaymentMethodById
);

module.exports = router;
