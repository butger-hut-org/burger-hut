const {StatusCodes} = require('http-status-codes');
const BaseAPIError = require('./base-api');

class NotFoundError extends BaseAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
