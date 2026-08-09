const express = require('express');
const auth = require('../middlewares/auth');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionValidation = require('../validations/subscriptionValidation');

const router = express.Router();

router.post(
    '/devices/register',
    auth,
    subscriptionValidation.registerDeviceRules,
    subscriptionController.registerDevice
);

router.post(
    '/subscriptions/upsert',
    auth,
    subscriptionValidation.upsertSubscriptionRules,
    subscriptionController.upsertSubscription
);

router.post(
    '/subscriptions/list',
    auth,
    subscriptionController.listSubscriptions
);

router.post(
    '/subscriptions/delete',
    auth,
    subscriptionValidation.deleteSubscriptionRules,
    subscriptionController.deleteSubscription
);

/** Cron / ops: header x-worker-secret = WORKER_SECRET */
router.post('/dispatch', subscriptionController.dispatchPush);

module.exports = router;
