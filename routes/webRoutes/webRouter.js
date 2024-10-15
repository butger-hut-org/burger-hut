const usersController = require('../../controllers/users');
const middleware = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
require("dotenv").config();

// Route for register page
router.get("/register", async (req, res) => {
  res.render("public/register", {});
});

// Route for login page
router.get("/login", async (req, res) => {
  res.render("public/login", {});
});

// Route for home page
router.get("/home", middleware.verifyJwt, async (req, res) => {
  res.render("./index");
});

// Route for displaying branches
router.get("/branches", middleware.verifyJwt, async (req, res) => {
  res.render("public/branches");
});

router.get('/menu', middleware.verifyJwt, async (req, res) => {
  res.render('./menu');
})

router.get("/adminPortal", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./adminPortal.ejs");
});

router.get("/branchManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./branchMgmt");
});

router.get("/productManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./productMgmt");
});

router.get("/userManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./userManagement.ejs");
});

router.get('/logout', usersController.logout);

module.exports = router;


