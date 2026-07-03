const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const adminUserValidation = require('../validations/adminUserValidation');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');

router.use(auth);
router.use(requireAdmin);

router.post(
    '/users/listUsers',
    adminUserValidation.listUserRules,
    adminUserValidation.validate,
    adminUserController.getListUser
);

router.post(
    '/users/detail',
    ...adminUserValidation.idBodyRule,
    adminUserValidation.validate,
    adminUserController.getUserDetail
);

router.post(
    '/users/updateActive',
    ...adminUserValidation.idBodyRule,
    adminUserValidation.updateActiveRules,
    adminUserValidation.validate,
    adminUserController.updateUserActive
);

router.post(
    '/users/delete',
    ...adminUserValidation.idBodyRule,
    adminUserValidation.validate,
    adminUserController.deleteUser
);

module.exports = router;
