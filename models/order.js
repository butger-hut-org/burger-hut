const mongoose = require('mongoose');

const OrderedProductSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    amount: {
        type: Number
    }
});

const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    products: [OrderedProductSchema],
}, {autoCreate: true});

const myDB = mongoose.connection.useDb('orders');

const OrderedProduct = mongoose.model('orderedProduct', OrderedProductSchema);

const Order = mongoose.model('order', orderSchema);

module.exports = {Order, OrderedProduct}