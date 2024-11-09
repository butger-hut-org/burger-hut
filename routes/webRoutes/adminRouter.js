const middleware = require("../../middleware/auth");
const express = require("express");
const adminRouter = express.Router();
require("dotenv").config();

adminRouter.get("/adminPortal", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./mgmt/adminPortal.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/branchManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./mgmt/branchMgmt.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/productManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./mgmt/productMgmt.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/orderManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./mgmt/orderMgmt.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/userManagement", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
  res.render("./mgmt/userManagement.ejs", { isAdmin: await middleware.isAdmin(req) });
});

adminRouter.get("/adminStats", middleware.verifyJwt, middleware.verifyAdmin, async (req, res) => {
    res.render("./mgmt/adminStats.ejs", { isAdmin: await middleware.isAdmin(req) });
});


module.exports = adminRouter;