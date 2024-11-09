const {StatusCodes} = require('http-status-codes');
const {Product} = require('../models/product');
const BaseError = require('../errors');
const logger = require("../middleware/logger");
const {postTweet} = require('../utils/twitter');


async function productCreate(req, res) {
    if (!req.body.name || !req.body.description || !req.body.basePrice ||
        !req.body.extraPrice || !req.body.category || !req.body.bestSeller) {
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
    postTweet(`We are happy to announce the addition of a new product to our restaurant:\n the ${req.body.name}\n ${req.body.description}\n only ${req.body.basePrice}$\n`)
    logger.info(`Post a tweet about upload this product: ${req.body.name}`);
    return res.status(StatusCodes.CREATED).json({result});
}

async function productUpdate(req, res) {
    const productId = req.params.id;
    if (!req.body.name || !req.body.description || !req.body.basePrice ||
        !req.body.extraPrice || !req.body.category || !req.body.bestSeller) {
        throw new BaseError.BadRequestError('Please provide values');
    }

    result = await Product.findOneAndUpdate({_id: productId}, {
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
    postTweet(`Unfortunately we have deleted this product:\n ${req.body.name}\n`);
    logger.info(`Posted a tweet about delete this product: ${req.body.name}`);
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
    const { category, bestSeller, minPrice, maxPrice } = req.query; // Destructure from query
    let searchParameters = [];
  
    if (category && category !== "All") {
      searchParameters.push({ category });
    }
    if (bestSeller && bestSeller !== "All") {
      searchParameters.push({ bestSeller });
    }
 
    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceFilter = {};
        if (minPrice !== undefined) {
           priceFilter.$gte = minPrice; // Add min price filter
        }
        if (maxPrice !== undefined) {
            priceFilter.$lte = maxPrice; // Add max price filter
        }
        searchParameters.push({ basePrice: priceFilter });
    }

    const result = searchParameters.length
      ? await Product.find({ $and: searchParameters })
      : await Product.find();
  
    if (!result || result.length === 0) {
        logger.info('No results for your product filters');
    }
  
    res.status(StatusCodes.OK).json(result);
};

async function productGroupBy(req, res){
    // response example:
    // {
    //     "_id": "Vegan", // Category or other group field
    //     "products": [
    //       { "name": "Vegan Burger", "price": 12.00, "category": "Vegan", ... }, 
    //       { "name": "Vegan Wrap", "price": 8.50, "category": "Vegan", ... }
    //     ],
    //     "totalProducts": 2
    // }

    const groupField = req.query.field; // Field to group by, passed in the query
    if (!groupField){
        throw new BaseError.BadRequestError('Please provide values');
    }

    try {
        const groupedProducts = await Product.aggregate([
            {
                $group: {
                    _id: `$${groupField}`, // Dynamically group by the provided field
                    products: { $push: "$$ROOT" }, // Push the entire product document
                    totalProducts: { $sum: 1 } // Count the total number of products in each group
                }
            }
        ]);
        res.status(StatusCodes.OK).json(groupedProducts);
    } catch (error) {
        throw new BaseError.InternalError("Failed to list products");
    }
}
module.exports = {
    productCreate,
    productUpdate,
    productDelete,
    productList,
    productSearch,
    productSpecificSearch,
    productGroupBy
};