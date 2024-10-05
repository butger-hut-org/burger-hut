var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    basePrice: { // The base price for S (small) size
        type: Number
    },
    extraPrice: { // When making the product to a bigger one, it adds this number to the price
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['Standard', 'Vegan', 'Spicy'],
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L'],
        default: null
    },
    bestSeller: {
        type: Boolean,
    },
}, {autoCreate: true});

const myDB = mongoose.connection.useDb('products');

var Product = mongoose.model('product', productSchema);

exports = module.exports = Product;