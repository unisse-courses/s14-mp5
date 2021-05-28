// imports
const router = require('express').Router();
// const cartController = require('../controllers/cartCont');
const productController = require('../controllers/productCont');
// const purchaseController = require('../controllers/purchaseCont');
// const {purchaseValidation} = require('../public/js/validators.js')
const {isPublic, isPrivate} = require('../middlewares/auth.js');

// public routes
// Homepage
router.get('/', isPublic, productController.displayLimitedItems);

// Marketplace
router.get('/marketplace', isPublic, productController.getAllProducts);
router.post('/marketplace', isPublic, productController.refreshProducts);

// Product Details
router.get('/product_details/:slug', isPublic, productController.getAProduct);

// export entire module
module.exports = router;