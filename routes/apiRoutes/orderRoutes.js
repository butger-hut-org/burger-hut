const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const { orderCreate, orderDelete, orderList } = require('../../controllers/order');

// POST /api/orders/create - Create a new order
router.post('/', middleware.verifyJwt, orderCreate);

// DELETE /api/orders/<id> - Delete an order
router.delete('/:id', middleware.verifyJwt, orderDelete);

// GET /api/orders/ - List all orders
router.get('/', middleware.verifyJwt, orderList);

module.exports = router;
