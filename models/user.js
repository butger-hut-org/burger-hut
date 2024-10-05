const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
require('dotenv').config();

const EMAIL_REGEX = RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/);
const USERNAME_REGEX = RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/);
const PASSWORD_REGEX = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
const CREDITNUMBER_REGEX = RegExp(/^\d{13,19}$/);
const CVV_REGEX = RegExp(/^\d{3,4}$/);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true,
        match: USERNAME_REGEX,
        minlength: 3,
        maxlength: 40,
    },
    password: {
        type: String,
        unique: false,
        required: true,
        match: PASSWORD_REGEX,
        minlength: 8,
        maxlength: 255,
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        match: EMAIL_REGEX,
        minlength: 5,
        maxlength: 255,
    },
    creditNumber: {
        type: String,  
        unique: true,
        required: true,
        match: CREDITNUMBER_REGEX
    },
    date: {
        type: Date,
        unique:false,
        required:true,
    },
    cvv: {
        type: String, 
        unique: false,
        required: true,
        match: CVV_REGEX
    },
    admin: {
        type: Boolean,
        unique: false,
        required: true,
    }

}, {autoCreate: true});

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.PRIVATE_KEY, {expiresIn: '2h'});
    return token;
}

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const schema = joi.object({
        username: joi.string().min(3).max(40).required(),
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(8).max(255).required(),
        creditNumber: joi.string().min(13).max(19).required(),
        date: joi.date().required(),
        cvv: joi.string().min(3).max(4).required(),
        admin: joi.boolean().required()
    });
    return schema.validate(user);
}

function validateLogin(credentials) {
    const schema = joi.object({
        username: joi.string().min(3).max(40).required(),
        password: joi.string().min(8).max(255).required(),
    });
    return schema.validate(credentials);
}

mongoose.connection.useDb('users');

exports = module.exports = User;

module.exports = {User, validateUser, validateLogin}