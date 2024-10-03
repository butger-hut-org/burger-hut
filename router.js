const express = require('express');
const appRouter = express.Router();
const OrderRouter = require('./routes/orderRoutes');

appRouter.use('/orders', OrderRouter);


module.exports = appRouter;