const {StatusCodes} = require('http-status-codes');
const {Order, OrderedProduct} = require('../models/order');
const Product = require('../models/product');

async function orderCreate (req, res) {
    if (!req.body.productName || !req.body.amount) {
        throw new BaseError.BadRequestError('Please provide values');
    }

    product_scheme = await Product.findOne({name: req.body.productName});
    if (!product_scheme) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid Product" });
    }

    orderedProduct = new OrderedProduct({
        product: product_scheme._id,
        amount: req.body.amount
    });

    if (req.body.setAmount) {
        update = {$set: {"products.$.amount": req.body.amount}};
        result = await Order.updateOne({
            user: req.user._id,
            products: {$elemMatch: {product: product_scheme._id}}
        }, update);
        if (!result) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: "Failed to update amount" });
        }
    } else {
        try {
            order = await Order.findOne({user: req.user._id});
            if (!order) {
                return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({ error: `No user: ${req.user._id}` });
            }

            result = await Order.updateOne({user: req.user._id},
                {$push: {products: orderedProduct}});
            if (!result) {
                return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({ error: "Failed to save new product" });
            }
        } catch (error) {
            newOrder = new Order({
                user: req.user._id,
                products: [orderedProduct]
            });
            result = await newOrder.save();
            if (!result) {
                return res
                  .status(StatusCodes.BAD_REQUEST)
                  .json({ error: "Failed to save new product" });
            }
        }

    }

    return res.status(StatusCodes.CREATED).json({result});
}
async function orderDelete (req, res) {
    user = await User.findOne({username: req.body.user.username});
    if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: `No user: ${req.body.user.username}` });
    }

    result = await Order.findOneAndDelete({user: user});
    if (!result) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: `Failed to delete order` });
    }
    res.status(StatusCodes.OK).json({result});
}

async function orderList (req, res) {return res.status(StatusCodes.CREATED).json({});}

module.exports = {
    orderCreate,
    orderDelete,
    orderList
};