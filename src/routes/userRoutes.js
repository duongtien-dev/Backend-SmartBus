const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidation = require('../validations/userValidation');
const auth = require('../middlewares/auth');

router.post(
    '/register',
    userValidation.registerRules,
    userValidation.validate,
    userController.register
);

router.post(
    '/register/verify-otp',
    userValidation.registerVerifyOtpRules,
    userValidation.validate,
    userController.registerVerifyOtp
);

router.post(
    '/login',
    userValidation.loginRules,
    userValidation.validate,
    userController.login
);

router.post(
    '/forgot-password/send-otp',
    userValidation.forgotPasswordSendOtpRules,
    userValidation.validate,
    userController.sendForgotPasswordOtp
);

router.post(
    '/forgot-password/reset',
    userValidation.forgotPasswordResetRules,
    userValidation.validate,
    userController.resetPasswordWithOtp
);

router.post(
    '/profile',
    auth,
    userValidation.updateUserRules,
    userValidation.validate,
    userController.updateUser
);

module.exports = router;
