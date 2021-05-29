// imports
const router = require('express').Router();
// const cartController = require('../controllers/cartCont');
const productController = require('../controllers/productCont');
// const purchaseController = require('../controllers/purchaseCont');
const {productValidation} = require('../public/js/validators.js')
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
router.post('/add_new_product', isPrivate, productValidation, upload.single('image'), productController.addProduct);

// Profile GET method
router.get('/profile', isPrivate, function(req, res) {
  res.render('profile', {
    title: 'Profile',
    username: req.session.name,
    loggedIn: req.session.user,
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  });
});

// Cart GET method
router.get('/cart', isPrivate, function(req, res) {
  res.render('cart', {
    title: 'Cart',
    username: req.session.name,
    loggedIn: req.session.user,
    email: req.session.email,
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  })
})

// 
// export entire module
module.exports = router;