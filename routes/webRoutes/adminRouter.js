const middleware = require("../../middleware/auth");
const express = require("express");
const adminRouter = express.Router();
require("dotenv").config();

adminRouter.get("/adminPortal", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./adminPortal.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/branchManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./branchMgmt.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/productManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./productMgmt.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/userManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./userManagement.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/adminStats", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
    res.render("./adminStats.ejs", { isAdmin: await middleware.isAdmin(req) });
});

module.exports = adminRouter;