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
    adminUserController.getListUser
);

router.post(
    '/users/detail',
    ...adminUserValidation.idBodyRule,
    adminUserController.getUserDetail
);

router.post(
    '/users/updateActive',
    ...adminUserValidation.idBodyRule,
    adminUserValidation.updateActiveRules,
    adminUserController.updateUserActive
);

router.post(
    '/users/delete',
    ...adminUserValidation.idBodyRule,
    adminUserController.deleteUser
);

router.post(
    '/users/createStaff',
    adminUserValidation.createStaffRules,
    adminUserController.createStaff
);

module.exports = router;
