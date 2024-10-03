const {StatusCodes} = require('http-status-codes');
const BaseAPIError = require('./base-api');

class UnauthenticatedError extends BaseAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;
