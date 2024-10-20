const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const { orderCreate, orderDelete, orderList } = require('../../controllers/order');

// POST /api/orders/create - Create a new order
router.post('/create', middleware.verifyJwt, orderCreate);

// POST /api/orders/delete - Delete an order
router.post('/delete', middleware.verifyJwt, orderDelete);

// GET /api/orders/list - List all orders for the user
router.get('/list', middleware.verifyJwt, orderList);

module.exports = router;
