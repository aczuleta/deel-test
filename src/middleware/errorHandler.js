const errorHandler = (err, req, res, next) => {
    const status = err.code || 500;
    const message = err.message || 'Internal server error';
    res.status(status);
    res.send(`Error ${status}: ${message}`);
};

module.exports = errorHandler;