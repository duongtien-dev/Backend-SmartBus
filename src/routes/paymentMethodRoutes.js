const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const paymentMethodValidation = require('../validations/paymentMethodValidation');
const auth = require('../middlewares/auth');

router.use(auth);

router.post(
    '/create',
    paymentMethodValidation.createPaymentMethodRules,
    paymentMethodValidation.validate,
    paymentMethodController.createPaymentMethod
);

router.post(
    '/update',
    ...paymentMethodValidation.idBodyRule,
    paymentMethodValidation.updatePaymentMethodRules,
    paymentMethodValidation.validate,
    paymentMethodController.updatePaymentMethod
);

router.post(
    '/my-payment-methods',
    paymentMethodController.getMyPaymentMethods
);

module.exports = router;
