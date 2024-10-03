const {User, validateUser, validateLogin} = require("../models/user.js");
const jwt = require("jsonwebtoken");
const BaseError = require('../errors');
const {bool} = require("joi");
require('dotenv').config();


async function prepareForRegistration(req, res, next) {
    req.body.admin = false;
    if (req.body.password != req.body.confirmPassword) {
        throw new BaseError.BadRequestError("passwords do not match");
    }
    delete req.body.confirmPassword;
    next();
}

async function verifyAdmin(req, res, next) {
    if (!req.user.admin) {
        throw new BaseError.UnauthorizedError('You do not have the required permission for this resource');
    }
    next();
}

async function verifyJwt(req, res, next) {
    // get the token from the cookie
    const token = req.cookies["jwt"];

    if (!token) {
        console.log("no token");
        // redirect if no token was supplied
        res.redirect('/api/auth/login');
        // throw new BaseError.UnauthenticatedError('no jwt token provided, please log in first');
    }

    try {
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = await User.findById(decoded._id).select("-password");
        next();
    } catch (ex) {
        //in case of invalid token
        // throw new BaseError.UnauthenticatedError('invalid jwt token');
        console.log("invalid token");
        res.redirect('/api/auth/login')
    }
}

async function isLoggedIn(req) {
    // returns whether a jwt token was used
    return Boolean(req.cookies["jwt"]);
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

module.exports = {prepareForRegistration, verifyJwt, verifyAdmin, isLoggedIn, isAdmin}