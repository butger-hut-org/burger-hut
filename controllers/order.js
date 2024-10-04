const {StatusCodes} = require('http-status-codes');
const { Order } = require('../models/order');
const { Product } = require('../models/product');
const { User } = require('../models/user')
const mongoose = require('mongoose');

async function orderCreate(req, res) {
    try {
      const userId = req.body.user && req.body.user._id;
      if (!userId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'User ID is required' });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: `Invalid user ID: ${userId}` });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      const products = req.body.products;
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Products must be a non-empty array' });
      }
  
      const orderProducts = [];
  
      for (const item of products) {
        const productData = item.product;
        const amount = item.amount;
  
        if (!productData || !amount) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Each product must have product details and an amount',
          });
        }
        const { name, price } = productData;
        if (!name || price === undefined) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Product name and price are required',
          });
        }
        let product = await Product.findOne({ name: productData.name });
  
        if (!product) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              error: 'Product does not exist',
            });
        } 
        const orderProduct = {
          product: product.toObject({ versionKey: false }), // Exclude __v field
          amount: amount,
        };
        orderProducts.push(orderProduct);
      }
      const order = new Order({
        user: userObjectId,
        products: orderProducts,
      });
      const result = await order.save();

      return res.status(StatusCodes.CREATED).json({ order: result });
    } catch (err) {
      console.error('Error in orderCreate:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An unexpected error occurred' });
    }
  }

  async function orderDelete(req, res) {
    try {
      if (!req.body.user || !req.body.user._id) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'User is not authenticated' });
      }
      const userId = req.body.user._id;
      const orderId = req.body.orderId;
      if (!orderId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Order ID is required' });
      }
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: `Invalid order ID: ${orderId}` });
      }
      const order = await Order.findById(orderId);
      if (!order) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Order not found' });
      }
      if (!order.user.equals(userId)) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: 'You are not authorized to delete this order' });
      }
      await Order.findByIdAndDelete(orderId);
      return res.status(StatusCodes.OK).json({
        message: 'Order deleted successfully',
        orderId: orderId,
      });
    } catch (err) {
      console.error('Error in orderDelete:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'An unexpected error occurred' });
    }
  }
  

async function orderList (req, res) {return res.status(StatusCodes.CREATED).json({});}

module.exports = {
    orderCreate,
    orderDelete,
    orderList
};