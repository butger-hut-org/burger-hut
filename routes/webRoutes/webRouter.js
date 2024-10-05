const middleware = require("../../middleware/auth");
const auth = require("../../controllers/users");
const express = require("express");
const router = express.Router();
require("dotenv").config();

// Route for register page
router.get("/register", (req, res) => {
  res.render("public/register", {});
});

// Route for login page
router.get("/login", (req, res) => {
  res.render("public/login", {});
});

// Route for home page
router.get("/home", async(req, res) => {
  res.render("./index",{isAuthenticated: await middleware.isLoggedIn(req), isAdmin: await middleware.isAdmin(req)});
});

// Route for displaying branches
router.get("/branches", async (req, res) => {
  try {
    res.render("public/branches", {});
  } catch (error) {
    res.status(500).send("An error occurred while fetching branches");
  }
});

router.get('/products/mgmt', async (req, res) => {
  res.render('./productsMgmt');
})

router.get('/menu', async (req, res) => {
  res.render('./menu');
})
module.exports = router;
