const middleware = require("../../middleware/auth");
const user = require("../../controllers/users");
const express = require("express");
const router = express.Router();

router.post("/register", middleware.prepareForRegistration, user.registerUser);
router.post("/login", user.login);
router.get("/logout", user.logout);
// router.delete("/delete", middleware.verifyJwt, middleware.verifyAdmin, user.deleteUser);
// router.put("/promote", middleware.verifyJwt, middleware.verifyAdmin, user.promoteUser);
// router.get("/list", middleware.verifyJwt, middleware.verifyAdmin, user.listUsers);
module.exports = router;