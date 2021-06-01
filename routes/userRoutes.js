// imports
const router = require('express').Router();
const cartController = require('../controllers/cartCont');
const productController = require('../controllers/productCont');
const orderController = require('../controllers/orderCont');
const userController = require('../controllers/userCont');
const {isPublic, isPrivate} = require('../middlewares/auth.js');
const multer = require('multer');

// Prep for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});

// public routes
// Homepage
router.get('/', isPublic, productController.displayLimitedItems);

// Marketplace
router.get('/marketplace', isPublic, productController.getAllProducts);
router.post('/marketplace', isPublic, productController.refreshProducts);

// Product Details
router.get('/product_details/:slug', isPublic, productController.getAProduct);

// private routes
// Add Product
router.get('/add_new_product', isPrivate, function(req, res) {
  res.render('addProduct', {
    title: 'Add Product',
    username: req.session.name,
    loggedIn: req.session.user,
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard logo'
  });
});
router.post('/add_new_product', isPrivate, upload.single('image'), productController.addProduct);

// Checkout
router.get('/checkout', isPrivate, cartController.checkout);
router.post('/checkout', isPrivate, orderController.checkout);

// Order History
router.get('/order_history', isPrivate, orderController.getOrderHistory);
// Order Details
router.get('/order_details/:slug', isPrivate, orderController.getOrderDetails);

// Product Management
router.get('/view_listing', isPrivate, productController.getMyProducts);
router.get('/hide_item/:_id', isPrivate, productController.hideItem);
router.get('/unhide_item/:_id', isPrivate, productController.unhideItem);
router.get('/limited_item/:_id', isPrivate, productController.limitedItem);
router.get('/unlimited_item/:_id', isPrivate, productController.unlimitedItem);
router.get('/delete_item/:_id', isPrivate, productController.deleteProduct);
router.get('/edit_item/:_id', isPrivate, productController.getProduct);
router.post('/edit_item/:_id', isPrivate, upload.single('image'), productController.editProduct);


// Profile GET method
router.get('/profile/:username', isPrivate, userController.getMyProfile);
router.post('/view_profile', isPrivate, userController.getAProfile);
router.post('/add_comment/:username', isPrivate, userController.postComment);

// export entire module
module.exports = router;