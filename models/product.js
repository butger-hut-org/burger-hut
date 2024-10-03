var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number
    },
    category: {
        type: String,
        enum: ['Standard', 'Vegan', 'Spicy'],
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L'],
    },
    bestSeller: {
        type: Boolean,
    },
}, {autoCreate: true});

const myDB = mongoose.connection.useDb('products');

var Product = mongoose.model('product', productSchema);

exports = module.exports = Product;