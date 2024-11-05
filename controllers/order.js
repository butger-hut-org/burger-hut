const { StatusCodes } = require('http-status-codes');
const { Order } = require('../models/order');
const { Product } = require('../models/product');

// Create a new order
async function orderCreate(req, res) {
    try {
        const userId = req.user._id; 

        const products = req.body.products;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Products must be a non-empty array.' });
        }

        const orderProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Product not found: ${item.productId}`);

                
                let price = product.basePrice;
                if (item.size === 'M') price += product.extraPrice;
                else if (item.size === 'L') price += 2 * product.extraPrice;

                return {
                    product: product.toObject({ versionKey: false }), 
                    productId: product._id.toString(),
                    amount: item.amount,
                    size: item.size, 
                    price: price, 
                };
            })
        );

        const newOrder = new Order({
            user: userId,
            products: orderProducts,
            orderDate: new Date(),
        });

        await newOrder.save();
        res.status(StatusCodes.CREATED).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

// Delete an order
async function orderDelete(req, res) {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found.' });
        }

        res.status(StatusCodes.OK).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Order deletion failed:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

// List all orders for the admin portal
async function orderList(req, res) {
    try {
        const orders = await Order.find({})
            .populate('user', 'username') 
            .populate('products.product');

        console.log('Fetched Orders:', orders); 
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Failed to retrieve orders:', error);
        res.status(500).json({ error: error.message });
    }
}

// Update an order
async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const { products } = req.body;
        const fullProductDetails = await Promise.all(
            products.map(async (product) => {
                const fullProduct = await Product.findById(product.productId);
                if (!fullProduct) {
                    throw new Error(`Product not found for ID: ${product.productId}`);
                }
                return {
                    product: fullProduct,
                    productId: product.productId,
                    amount: product.amount,
                    size: product.size
                };
            })
        );
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { products: fullProductDetails },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
        }

        res.status(StatusCodes.OK).json(updatedOrder);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}




async function orderFetchById(req, res) {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('products.product');
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


module.exports = { orderCreate, orderDelete, orderList, updateOrder, orderFetchById };
