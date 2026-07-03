const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadMax5Images } = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');
router.use(auth);

const uploadMiddleware = (req, res, next) => {
    uploadMax5Images(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

router.post(
    '/images',
    uploadMiddleware,
    uploadController.uploadImages
);

module.exports = router;
