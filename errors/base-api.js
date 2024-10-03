class BaseAPIError extends Error {
    constructor(message) {
        super(message)
        this.msg = message;
    }
}

module.exports = BaseAPIError