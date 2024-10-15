const usersController = require("../../controllers/users");
const middleware = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/register", async (req, res) => {
  res.render("public/register", {});
});

router.get("/login", async (req, res) => {
  res.render("public/login", {});
});

router.get("/home", middleware.verifyJwt, async (req, res) => {
  res.render("./index", { isAdmin: await middleware.isAdmin(req) });
});

router.get("/branches", middleware.verifyJwt, async (req, res) => {
  res.render("public/branches", { isAdmin: await middleware.isAdmin(req) });
});

router.get("/menu", middleware.verifyJwt, async (req, res) => {
  res.render("./menu", { isAdmin: await middleware.isAdmin(req) });
})

router.get("/adminPortal", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./adminPortal.ejs", { isAdmin: await middleware.isAdmin(req) });
});

router.get("/branchManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./branchMgmt", { isAdmin: await middleware.isAdmin(req) });
});

router.get("/productManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./productMgmt", { isAdmin: await middleware.isAdmin(req) });
});

router.get("/userManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./userManagement.ejs", { isAdmin: await middleware.isAdmin(req) });
});

router.get('/logout', usersController.logout);

module.exports = router;


