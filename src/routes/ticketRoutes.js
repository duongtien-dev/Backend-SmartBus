const express = require('express');
const auth = require('../middlewares/auth');
const ticketController = require('../controllers/ticketController');
const ticketValidation = require('../validations/ticketValidation');

const router = express.Router();
router.use(auth);

router.post(
    '/create',
    ticketValidation.createTicketRules,
    ticketController.createTicket
);

router.post(
    '/verify-scanned-qr',
    ticketValidation.verifyScannedQrRules,
    ticketController.verifyScannedQr
);

router.post(
    '/my',
    ticketValidation.myTicketsBodyRules,
    ticketController.getMyTickets
);

router.post(
    '/detail',
    ...ticketValidation.idBodyRule,
    ticketController.getTicketDetail
);

module.exports = router;
