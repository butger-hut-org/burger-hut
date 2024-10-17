const {StatusCodes} = require('http-status-codes');
const Product = require('../models/product');
const BaseError = require('../errors');
const logger = require("../middleware/logger");
const {postTweet} = require('../utils/twitter');


async function productCreate(req, res) {
    if (!req.body.name || !req.body.description || !req.body.basePrice ||
        !req.body.category || !req.body.bestSeller) {
        throw new BaseError.BadRequestError('Please provide values');
    }

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        basePrice: req.body.basePrice,
        extraPrice: req.body.extraPrice,
        category: req.body.category,
        bestSeller: req.body.bestSeller,
    });

    result = await newProduct.save();
    if (!result) {
        throw BaseError.InternalError("Failed to save new product");
    }
    logger.info(`Successfully created product ${req.body.name}`);
    postTweet(`we have added a new product!!!:\n the ${req.body.name}\n ${req.body.description}\n only ${req.body.basePrice}$\n OMG`)
    logger.info(`Post a tweet about upload this product: ${req.body.name}`);
    return res.status(StatusCodes.CREATED).json({result});
}

async function productUpdate(req, res) {
    if (!req.body.name || !req.body.description || !req.body.basePrice ||
        !req.body.category || !req.body.bestSeller) {
        throw new BaseError.BadRequestError('Please provide values');
    }

    result = await Product.findOneAndUpdate({_id: req.body.productId}, {
        name: req.body.name,
        description: req.body.description,
        basePrice: req.body.basePrice,
        extraPrice: req.body.extraPrice,
        category: req.body.category,
        bestSeller: req.body.bestSeller
    });
    if (!result) {
        throw new BaseError.NotFoundError(`Failed to update product : ${req.body.name}`);
    }

    res.status(StatusCodes.OK).json({result});
}

async function productDelete(req, res) {
    result = await Product.findOneAndDelete({_id: req.body.productId});
    if (!result) {
        throw new BaseError.NotFoundError(`Failed to delete product: ${req.body.productId}`);
    }
    logger.info(`Successfully deleted product ${req.body.name}`);
    postTweet(`we have deleted this product:\n ${req.body.name}\n`)
    logger.info(`Post a tweet about delete this product: ${req.body.name}`);
    res.status(StatusCodes.OK).json({result});
};

async function productList(req, res) {
    result = await Product.find();
    if (!result) {
        throw new BaseError.InternalError("Failed to list products");
    }
    logger.info(`Successfully get all product`);
    res.status(StatusCodes.OK).json({result});
};

async function productSearch(req, res) {
    const productId = req.query.productId;
    result = await Product.findOne({_id: productId});
    if (!result) {
        throw new BaseError.NotFoundError(`No product: ${productId}`);
    }

    res.status(StatusCodes.OK).json({result});
};

async function productSpecificSearch(req, res) {
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