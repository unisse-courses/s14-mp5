const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');

// This function adds a product to the cart
exports.addToCart = function(req, res) {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var user = req.session.user;
    var product = req.params.id;
    var quantity = 1;

    if (req.body.qty){
      quantity = parseInt(req.body.qty);
    }

    productModel.getOne({_id: product}, function(err, cart) {
      if (err) throw err;
      var slug = cart.toObject().slug;
      cartModel.addProduct(user, product, quantity, function(err, cart) {
        if(err) {
          req.flash('error_msg', 'Could not add product.');
          res.redirect('/product_details/' + slug);
        }
        else {
          req.flash('success_msg', 'Product added to cart!');
          res.redirect('/product_details/' + slug);
        }
      });
    });
  }
};

exports.removeFromCart = function(req, res) {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var user = req.session.user;
    var product = req.params.id;

    cartModel.removeProduct(user, product, function(err, cart) {
      console.log('cart(deletefromcart): ' + cart);
      if(err) {
        req.flash('error_msg', 'Could not remove product.');
        res.redirect('/cart');
      }
      else {
        req.flash('success_msg', 'Product removed from the cart!');
        res.redirect('/cart');
      }
    });
  }
};

exports.getUserCart = function(req, res) {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var user = req.session.user;

    cartModel.getByUser(user, function(err, result) {
      if(result) {
        res.render('cart', {
          username: req.session.name,
          title: "Shopping Cart", 
          loggedIn: user,
          products: result.products,
          total: result.total
        });
      }
      else {
        console.log(err);
        res.render('cart', {
          username: req.session.name,
          title: "Shopping Cart", 
          loggedIn: user,
          products: null
        });
      }
    });
  }
  else {
    console.log(errors);
  }
}

exports.checkout = function(req, res) {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    var user = req.session.user;
    cartModel.getByUser(user, function(err, result) {
      if (result) {
        res.render('checkout', {
          username: req.session.name,
          title: "Checkout", 
          loggedIn: user,
          products: result.products,
          total: result.total
        });
      }
      else {
        console.log(err);
        res.render('checkout', {
          username: req.session.name,
          title: "Checkout", 
          loggedIn: user,
          products: null,
          total: 0
        });
      }
    });
  }
  else {
    console.log(errors);
  }
}