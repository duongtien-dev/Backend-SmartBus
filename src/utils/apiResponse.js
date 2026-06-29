function success(res, { status = 200, message, data } = {}) {
    const body = { success: true };
    if (message != null && message !== '') body.message = message;
    if (data !== undefined) body.data = data;
    return res.status(status).json(body);
}

function error(res, { status = 400, message, errors } = {}) {
    const body = { success: false };
    if (message != null && message !== '') body.message = message;
    if (errors != null) body.errors = errors;
    if (!body.message && !body.errors) body.message = 'Lỗi';
    return res.status(status).json(body);
}

module.exports = {
    success,
    error,
};
