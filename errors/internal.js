const {StatusCodes} = require('http-status-codes');
const BaseAPIError = require('./base-api');

class InternalError extends BaseAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

module.exports = InternalError;
