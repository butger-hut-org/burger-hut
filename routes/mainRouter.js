const express = require('express');
const appRouter = express.Router();
const OrderRouter = require('./orderRoutes');
const UsersRouter = require('./usersRoutes');
const branchRouter = require('./branchRoutes');


appRouter.use('/users', UsersRouter);
appRouter.use('/orders', OrderRouter);
appRouter.use('/branches', branchRouter);

module.exports = appRouter;