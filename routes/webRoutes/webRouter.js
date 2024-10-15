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
  res.render("public/branches", {isAuthenticated: await middleware.isLoggedIn(req), isAdmin: await middleware.isAdmin(req)});
});

router.get("/branchManagement", async (req, res) => {
  res.render("./branchMgmt", {isAuthenticated: await middleware.isLoggedIn(req), isAdmin: await middleware.isAdmin(req)});
});

router.get("/products/mgmt", async (req, res) => {
  res.render("./productsMgmt");
});

router.get('/menu', async (req, res) => {
  res.render('./menu');
})

router.get("/adminPortal", middleware.verifyJwt, middleware.verifyAdmin, (req, res) => {
      res.render("./adminPortal.ejs", {isAuthenticated: true, isAdmin: true});
});

router.get(
  "/userManagement",
  middleware.verifyJwt,
  middleware.verifyAdmin,
  (req, res) => {
      res.render("./userManagement.ejs", {
          isAuthenticated: true,
          isAdmin: true,
      });
  }
);
const usersController = require('../../controllers/users');

router.get('/logout', usersController.logout);

module.exports = router;


