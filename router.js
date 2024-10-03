const express = require('express');
const appRouter = express.Router();
const OrderRouter = require('./routes/orderRoutes');
const UsersRouter = require('./routes/usersRoutes');
const branchRouter = require('./routes/branchRoutes');


appRouter.use('/', UsersRouter);
appRouter.use('/orders', OrderRouter);
appRouter.use('/branches', branchRouter);

module.exports = appRouter;