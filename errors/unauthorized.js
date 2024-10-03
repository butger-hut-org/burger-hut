const {StatusCodes} = require('http-status-codes');
const BaseAPIError = require('./base-api');

class UnauthorizedError extends BaseAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnauthorizedError;
