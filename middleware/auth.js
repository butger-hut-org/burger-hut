const {User} = require("../models/user.js");
const jwt = require("jsonwebtoken");
const BaseError = require('../errors');
const logger = require("../middleware/logger");
const middleware = require("../middleware/auth");
require('dotenv').config();


async function prepareForRegistration(req, res, next) {
    try{
        req.body.admin = false;
        if (req.body.password != req.body.confirmPassword) {
            throw new BaseError.BadRequestError("passwords do not match");
        }
        delete req.body.confirmPassword;
        next();
    } catch (error) {
        return next(error)
    }
}

async function verifyAdmin(req, res, next) {
    if (!req.user.admin) {
        const header = "Permission Denied!";
        const message = "You do not have permission to access this resource.";
        logger.error(message);
        return res.render("../views/includes/error", { header, message, isAdmin: false });
    }
    next();
}

async function verifyJwt(req, res, next) {
    const token = req.cookies["jwt"];
    if (!token) {
        const header = "Missing Token!";
        const message = "No token provided, please log in first.";
        logger.error(message);
        return res.render("../views/includes/error", { header, message, isAdmin: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = await User.findById(decoded._id).select("-password");
        next();
    } catch (ex) {
        logger.error("invalid token");
    }
}

async function isLoggedIn(req) {
    // returns whether a jwt token was used
    return Boolean(req.cookies && req.cookies["jwt"]);
}


async function isAdmin(req) {
    // checks whether the current user is an admin
    // this function doest verify that the jwt is valid!!
    // to check that use verifyAdmin
    if (await isLoggedIn(req)) {
        const token = req.cookies["jwt"];
        decoded = jwt.decode(token, process.env.PRIVATE_KEY);
        return (await User.findById(decoded._id).select("admin")).admin;
    }
}

module.exports = {
    prepareForRegistration,
    verifyJwt,
    verifyAdmin,
    isLoggedIn,
    isAdmin
}