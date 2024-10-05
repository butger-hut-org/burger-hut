const errorHandlerMiddleware = (err, req, res, next) => {
    console.log('Error handling')
    const statusCode = err.statusCode || 500;

    // Check if the error occurred on the register page
    if (req.originalUrl === '/register') {
        return res.status(statusCode).render('register', { error: err.message });
    }

    // For other routes, handle errors as needed
    res.status(statusCode).send({
        status: 'error',
        message: err.message,
    });
};

module.exports = errorHandlerMiddleware;