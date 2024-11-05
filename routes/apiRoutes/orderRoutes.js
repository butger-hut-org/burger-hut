const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();
const { orderCreate, orderDelete, orderList, updateOrder, orderFetchById } = require('../../controllers/order');

// POST /api/orders/create - Create a new order
router.post('/', middleware.verifyJwt, orderCreate);

// DELETE /api/orders/<id> - Delete an order
router.delete('/:id', middleware.verifyJwt, orderDelete);

// GET /api/orders/ - List all orders
router.get('/', middleware.verifyJwt, orderList);

// PUT /api/orders/<id> - Update an order
router.put('/:id', middleware.verifyJwt, updateOrder);

// GET /api/orders/:id - Fetch a single order
router.get('/:id', middleware.verifyJwt, orderFetchById);

module.exports = router;
