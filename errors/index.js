const BaseAPIError = require('./base-api');
const InternalError = require('./internal');
const UnauthenticatedError = require('./unauthenticated');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
const UnauthorizedError = require('./unauthorized');
module.exports = {
    BaseAPIError,
    InternalError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
};
