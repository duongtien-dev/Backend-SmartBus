const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidation = require('../validations/userValidation');
const auth = require('../middlewares/auth');

router.post(
    '/register',
    userValidation.registerRules,
    userController.register
);

router.post(
    '/register/verify-otp',
    userValidation.registerVerifyOtpRules,
    userController.registerVerifyOtp
);

router.post(
    '/login',
    userValidation.loginRules,
    userController.login
);

router.post(
    '/forgot-password/send-otp',
    userValidation.forgotPasswordSendOtpRules,
    userController.sendForgotPasswordOtp
);

router.post(
    '/forgot-password/reset',
    userValidation.forgotPasswordResetRules,
    userController.resetPasswordWithOtp
);

router.post(
    '/profile',
    auth,
    userValidation.updateUserRules,
    userController.updateUser
);

module.exports = router;
