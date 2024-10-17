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
} = require('../../controllers/product');
// for now it is without auth
router.route('/create').post(middleware.verifyJwt, middleware.verifyAdmin, productCreate);
router.route('/update').post(middleware.verifyJwt, middleware.verifyAdmin, productUpdate);
router.route('/delete').delete(middleware.verifyJwt, middleware.verifyAdmin, productDelete);

router.route('/list').get(productList);
router.route('/search').get(productSearch);
router.route('/searchSpecific').get(productSpecificSearch);

module.exports = router;
