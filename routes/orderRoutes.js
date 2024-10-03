const express = require('express');
const middleware = require("../middleware/auth")
const router = express.Router();
const {
    orderCreate,
    orderDelete,
    orderList
} = require('../controllers/order');

router.route('/create').post(middleware.verifyJwt, orderCreate);
router.route('/delete').post(middleware.verifyJwt, orderDelete);
router.route('/list').get(middleware.verifyJwt, orderList);
module.exports = router;