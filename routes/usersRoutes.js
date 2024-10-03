const express = require('express');
const router = express.Router();

// Route for register page
router.get('/register', (req, res) => {
  res.render('public/register', {});
});

// Route for login page
router.get('/login', (req, res) => {
  res.render('public/login', {});
});

module.exports = router;