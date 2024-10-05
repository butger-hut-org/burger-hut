// USER CONTROLLER
const { User, validateUser, validateLogin } = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BaseError = require('../errors');
require('dotenv').config();

const COOKIE_MAX_AGE = 2 * 60 * 60 * 1000;

async function registerUser(req, res, next) {
    try {
        let user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            creditNumber: req.body.creditNumber,
            date: req.body.date,
            cvv: req.body.cvv,
            admin: req.body.admin
        });

        // validate the request body first
        const { error } = validateUser(req.body);
        if (error) {
            throw new BaseError.BadRequestError(error.details[0].message);
        }
        //find an existing user
        if (await User.findOne({ email: user.email }) || await User.findOne({ username: user.username })) {
            throw new BaseError.BadRequestError('User already registered');
        }

        if (await User.findOne({ creditNumber: user.creditNumber })) {
            throw new BaseError.BadRequestError('Credit card is already in use');
        }


        console.log('after checks')
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();

        const token = user.generateAuthToken();

        res.cookie("jwt", token, {
            maxAge: COOKIE_MAX_AGE,
            httpOnly: true,
            sameSite: true,
            secure: true,
            sameSite: 'strict'
        });
        res.json({message: "Registered Successfully"})
    } catch (error) {
        console.log('Error in RegisterUser: sending to error handler')
        next(error)
    }
}

async function login(req, res, next) {
    try{
        console.log('[Login]', req.body);
        const { error } = validateLogin(req.body);
        if (error) {
            console.log("error")
            throw new BaseError.BadRequestError(error.details[0].message);
        }
        let user = await User.findOne({ username: req.body.username })
        console.log(user)
        if (!user) {
            console.log("!user")
            throw new BaseError.UnauthenticatedError('incorrect user or password');
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = user.generateAuthToken();
            res.cookie("jwt", token, {
                maxAge: COOKIE_MAX_AGE,
                httpOnly: true,
                sameSite: true,
                secure: true,
                sameSite: 'strict'
            }).send({
                _id: user._id,
                username: user.username,
                email: user.email
            });
            // res.json({message: "Login Successfully"})
            // res.redirect("/main") 
        } else {
            console.log('wrong password');
            throw new BaseError.UnauthenticatedError('incorrect user or password');
        }
    }catch (error) {
        console.log(error);
        console.log('Error in login: sending to error handler')
        next(error)
    }
}

async function logout(req, res) {
    res.clearCookie("jwt");
    res.redirect("/");
}

async function listUsers(req, res) {
    const userList = await User.find({}).select('-password').select('-_id');
    res.send(userList);
}

async function deleteUser(req, res, next) {
    try{
        const deletedUser = await User.findOneAndDelete({ username: req.body.userToDelete });
        if (!deletedUser) {
            throw new BaseError.BadRequestError('user does not exist');
        }
        res.send(`the user "${deletedUser.username}" was deleted`);
    } catch(error){
        console.log('Error in deleteUser: sending to error handler')
        next(error)
    }

}
async function promoteUser(req, res, next) {
    try{
        const promotedUser = await User.findOneAndUpdate({username: req.body.userToPromote}, {admin: true});
        if (!promotedUser) {
            throw new BaseError.BadRequestError('user does not exist');
        }
        res.send(`the user "${promotedUser.username}" was promoted`);
    }catch(error){
        console.log('Error in promoteUser: sending to error handler')
        next(error)
    }
    
}

module.exports = {registerUser, login, listUsers, deleteUser, logout, promoteUser};