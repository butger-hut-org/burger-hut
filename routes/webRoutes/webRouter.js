const middleware = require("../../middleware/auth");
const auth = require("../../controllers/users");
const express = require("express");
const router = express.Router();

// Route for register page
router.get("/register", (req, res) => {
  res.render("public/register", {});
});

// Route for login page
router.get("/login", (req, res) => {
  res.render("public/login", {});
});

router.get("/branches", async (req, res) => {
  try {
    res.render('public/branches', {});
  } catch (error) {
    res.status(500).send('An error occurred while fetching branches');
  }
});
module.exports = router;
