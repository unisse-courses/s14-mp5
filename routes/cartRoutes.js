// imports
const router = require('express').Router();
const cartController = require('../controllers/cartCont');
const {isPrivate} = require('../middlewares/auth');

// public routes

// private routes
// add item to cart
router.post('/add_to_cart/:id', isPrivate, cartController.addToCart);

// remove item from cart
router.get('/delete_from_cart/:id', isPrivate, cartController.removeFromCart);

// Cart GET method
router.get('/cart', isPrivate, cartController.getUserCart);

// export entire module
module.exports = router;