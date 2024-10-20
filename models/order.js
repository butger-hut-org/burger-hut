const mongoose = require('mongoose');
const { productSchema } = require('./product');

const orderProductSchema = new mongoose.Schema({
  product: productSchema,
  productId: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [orderProductSchema],
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
