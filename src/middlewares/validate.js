const { validationResult } = require('express-validator');
const apiRes = require('../utils/apiResponse');

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return apiRes.error(res, { errors: errors.array() });
    }
    next();
}

/** Tự gắn validate trước handler cuối của mọi router.post */
function autoValidate() {
    const { Router } = require('express');
    const originalPost = Router.prototype.post;

    Router.prototype.post = function postWithValidate(path, ...handlers) {
        if (!handlers.length) {
            return originalPost.call(this, path);
        }
        const handler = handlers.pop();
        return originalPost.call(this, path, ...handlers, validate, handler);
    };
}

module.exports = {
    validate,
    autoValidate,
};
