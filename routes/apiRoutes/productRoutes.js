const express = require('express');
// const middleware = require("../middleware/auth")
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
// router.route('/create').post(middleware.verifyJwt, middleware.verifyAdmin, productCreate);
// router.route('/update').post(middleware.verifyJwt, middleware.verifyAdmin, productUpdate);
// router.route('/delete').post(middleware.verifyJwt, middleware.verifyAdmin, productDelete);

router.route('/create').post(productCreate);
router.route('/update').post(productUpdate);
router.route('/delete').post(productDelete);
router.route('/list').get(productList);
router.route('/search').get(productSearch);
router.route('/searchSpecific').get(productSpecificSearch);
router.route('/groupBy').get(productGroupBy);

module.exports = router;
