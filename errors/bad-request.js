const {StatusCodes} = require('http-status-codes');
const BaseAPIError = require('./base-api');

class BadRequestError extends BaseAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;
