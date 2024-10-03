const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = (err, _req, res, _next) => {
    if (err.name === 'CastError') {
        err.message = `No item found with id : ${err.value}`;
        err.statusCode = StatusCodes.NOT_FOUND;
    } else if (err.name === 'ValidationError') {
        err.message = `Got invalid values : ${err.value}`;
        err.statusCode = StatusCodes.BAD_REQUEST;
    }

    console.error(`Something went wrong: ${err}`);
    return res.status(err.statusCode).json({msg: err});
};

module.exports = errorHandlerMiddleware;
