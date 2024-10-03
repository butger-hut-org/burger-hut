// Product CONTROLLER
const {StatusCodes} = require('http-status-codes');
const Product = require('../models/product');
const BaseError = require('../errors');
// const {postTweet} = require('../twitter');


const productCreate = async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price ||
        !req.body.category || !req.body.size || !req.body.bestSeller) {
        throw new BaseError.BadRequestError('Please provide values');
    }

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        size: req.body.size,
        bestSeller: req.body.bestSeller,
    });

    result = await newProduct.save();
    if (!result) {
        throw BaseError.InternalError("Failed to save new product");
    }
    // postTweet(`we have added a new product!!!:\n the ${req.body.name}\n ${req.body.description}\n only ${req.body.price}$\n OMG`)
    // TODO: post on facebook
    return res.status(StatusCodes.CREATED).json({result});
}

const productUpdate = async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price ||
        !req.body.category || !req.body.size || !req.body.bestSeller) {
        throw new BaseError.BadRequestError('Please provide values');
    }

    // using callback
    result = await Product.findOneAndUpdate({name: req.body.name}, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        size: req.body.size,
        bestSeller: req.body.bestSeller,
    });
    if (!result) {
        throw new BaseError.NotFoundError(`Failed to update product : ${req.body.name}`);
    }

    res.status(StatusCodes.OK).json({result});
}

const productDelete = async (req, res) => {
    result = await Product.findOneAndDelete({name: req.body.name});
    if (!result) {
        throw new BaseError.NotFoundError(`Failed to delete product: ${req.body.name}`);
    }

    res.status(StatusCodes.OK).json({result});
};

const productList = async (req, res) => {
    result = await Product.find();
    if (!result) {
        throw new BaseError.InternalError("Failed to list products");
    }

    res.status(StatusCodes.OK).json({result});
};

const productSearch = async (req, res) => {
    result = await Product.findOne({name: req.body.name});
    if (!result) {
        throw new BaseError.NotFoundError(`No product: ${req.body.name}`);
    }

    res.status(StatusCodes.OK).json({result});
};

const productSpecificSearch = async (req, res) => {
    let searchParametrs = [];

    if (!req.query["category"].includes("All")) {
        searchParametrs.push({category: req.query.category});
    }
    if (!req.query["size"].includes("All")) {
        searchParametrs.push({size: req.query.size});
    }
    if (!req.query["bestSeller"].includes("All")) {
        searchParametrs.push({bestSeller: req.query.bestSeller});
    }

    console.log(searchParametrs);
    if (!(Array.isArray(searchParametrs) && searchParametrs.length)) {
        result = await Product.find();
    } else {
        result = await Product.find({
            $and: searchParametrs
        });
    }

    if (!result) {
        throw new BaseError.NotFoundError(`No product: ${req.query.name}`);
    }

    res.status(StatusCodes.OK).json({result});
};

module.exports = {
    productCreate,
    productUpdate,
    productDelete,
    productList,
    productSearch,
    productSpecificSearch,
};