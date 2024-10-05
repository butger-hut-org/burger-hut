const express = require('express');
const appRouter = express.Router();
const OrderRouter = require('./orderRoutes');
const UsersRouter = require('./usersRoutes');
const branchRouter = require('./branchRoutes');
const ProductRouter = require('./productRoutes');


appRouter.use('/users', UsersRouter);
appRouter.use('/orders', OrderRouter);
appRouter.use('/branches', branchRouter);
appRouter.use('/products', ProductRouter);


module.exports = appRouter;