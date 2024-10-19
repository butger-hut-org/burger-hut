const express = require('express');
const middleware = require("../../middleware/auth")
const router = express.Router();
const {
    productCreate,
    productUpdate,
    productDelete,
    productList,
    productSearch,
    productSpecificSearch,
    productGroupBy
} = require('../../controllers/product');
// for now it is without auth
router.route('/').post(middleware.verifyJwt, middleware.verifyAdmin, productCreate); // create
router.route('/update').post(middleware.verifyJwt, middleware.verifyAdmin, productUpdate); // update
router.route('/').delete(middleware.verifyJwt, middleware.verifyAdmin, productDelete); // delete

router.route('/').get(productList); //list
router.route('/search').get(productSearch);
router.route('/searchSpecific').get(productSpecificSearch);
router.route('/groupBy').get(productGroupBy);

module.exports = router;
