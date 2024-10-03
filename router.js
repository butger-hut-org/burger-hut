const express = require('express');
const appRouter = express.Router();
const OrderRouter = require('./routes/orderRoutes');
const branchRouter = require('./routes/branchRoutes');

appRouter.use('/orders', OrderRouter);
appRouter.use('/branches', branchRouter);

module.exports = appRouter;