const express = require('express');
const appRouter = express.Router();
const OrderRouter = require('./routes/orderRoutes');
const UsersRouter = require('./routes/usersRoutes');

appRouter.use('/users', UsersRouter);
appRouter.use('/orders', OrderRouter);


module.exports = appRouter;