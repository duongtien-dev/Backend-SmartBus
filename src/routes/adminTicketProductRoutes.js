const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');
const ticketProductController = require('../controllers/ticketProductController');
const ticketProductValidation = require('../validations/ticketProductValidation');

router.use(auth);
router.use(requireAdmin);

router.post('/list', ticketProductController.listAll);

router.post(
    '/detail',
    ...ticketProductValidation.idBodyRule,
    ticketProductController.getDetail
);

router.post(
    '/create',
    ticketProductValidation.createRules,
    ticketProductController.create
);

router.post(
    '/update',
    ...ticketProductValidation.idBodyRule,
    ticketProductValidation.updateRules,
    ticketProductController.update
);

router.post(
    '/delete',
    ...ticketProductValidation.idBodyRule,
    ticketProductController.softDelete
);

module.exports = router;
