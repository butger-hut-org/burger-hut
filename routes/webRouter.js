const middleware = require("../middleware/auth")
const user = require("../controllers/users");
const express = require('express');
const router = express.Router();

// Route for register page
router.get('/register', (req, res) => {
  res.render('public/register', {});
});
router.post("/register", middleware.prepareForRegistration, user.registerUser);


// Route for login page
router.get('/login', (req, res) => {
  res.render('public/login', {});
});
router.post("/login", user.login);

module.exports = router;