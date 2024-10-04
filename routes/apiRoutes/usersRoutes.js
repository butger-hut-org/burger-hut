const middleware = require("../../middleware/auth");
const auth = require("../../controllers/users");
const express = require("express");
const router = express.Router();

router.post("/register", middleware.prepareForRegistration, auth.registerUser);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../../models/user'); 
// const { BadRequestError, ConflictError } = require('../../errors'); 

// router.post('/register', async (req, res, next) => {
//     const { username, password } = req.body;

//     try {
//         // Check for required fields
//         if (!username || !password) {
//             throw new BadRequestError('Username and password are required.');
//         }

//         // Check if the user already exists
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             throw new ConflictError('Username is already taken.');
//         }

//         // Logic to create a new user
//         const newUser = await User.create({ username, password });

//         // Redirect to login after successful registration
//         res.redirect('/login');
//     } catch (error) {
//         next(error); // Pass the error to the error handler middleware
//     }
// });

// module.exports = router;