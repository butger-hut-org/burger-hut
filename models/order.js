const mongoose = require('mongoose');
const { productSchema } = require('./product'); // Adjust the path as necessary

// Define the orderProductSchema by adding the 'amount' field
const orderProductSchema = new mongoose.Schema({
  product: productSchema, // Embed productSchema under 'product' field
  amount: {
    type: Number,
    required: true,
  },
}, { _id: false });

// Define the main orderSchema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [orderProductSchema],
  orderDate: { type: Date, default: Date.now },
}, { autoCreate: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };