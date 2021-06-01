const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const dateFormat = require('dateformat');
const {validationResult} = require('express-validator');

exports.checkout = function(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const {region, province, city, barangay, address} = req.body;
    var user = req.session.user;
    cartModel.getByUser(user, function(err, cart) {
      if (err) throw err;
      if (cart) {
        var cartItems = [];
        cartModel.deleteByuser(user, function(err, result) {
          if (err) throw err;
          if (result.ok == 1) {
            cart.products.forEach(function(item) {
              var prod = {
                name: item.name,
                id: item.id,
                qty: item.qty,
                image: item.image,
                unitPrice: item.unitPrice,
                subPrice: item.subPrice
              };
              cartItems.push(prod);
            });
            
            var status = 'Bought';
            var dAddress = address + ', ' + barangay + ', ' + city + ', ' + region + ', ' + province;

            var details = {
              user: user,
              cartItems: cartItems,
              deliveryAddress: dAddress,
              status: status,
              totalPrice: cart.total
            }
  
            orderModel.create(details, function(err, result) {
              if (result) {
                var orderId = result.toObject()._id;
                res.redirect('/order_details/' + orderId);
              }
              else {
                res.render('/cart', {
                  username: req.session.name,
                  title: "My Cart", 
                  loggedIn: req.session.user,
                  products: cart.products
                });
              }
            });
          }
          else {
            // delete cart failed
            res.redirect('/');
          }
        });
      
      }
    });
  }
}

exports.getOrderDetails = function(req, res) {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    console.log('test');
    console.log(req.params.slug);
    orderModel.getByID({_id: req.params.slug}, function(err, order) {
      if(order.user.equals(req.session.user)) {
        var cartItems = order.cartItems;

        cartItems.forEach(function(item){
          item.unitPrice = (item.unitPrice).toFixed(2);
          item.subPrice = (item.subPrice).toFixed(2);
        });

        var date = order.orderDate;
        date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
        if (order) {
          res.render('orderDetails', {
            username: req.session.name,
            title: 'Order Details',
            loggedIn: req.session.user,
            _id: order._id,
            status: order.status,
            orderDate: date,
            cartItems: cartItems,
            total: order.totalPrice.toFixed(2),
          });
        }
        else {
          res.redirect('/');
        }
      }
      else {
        res.redirect('/')
      }
    });
  }
}

exports.getOrderHistory = function(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()){
    orderModel.getByQuery({user: req.session.user}, function(err, orders) {
      if (err) throw err;
      var ordersCopy = JSON.parse(JSON.stringify(orders));
      ordersCopy.forEach(function(order){
        var products = order.cartItems;
        var totalQuantity = 0;

        var firstImg = null;
        products.forEach(function(product){
          if (firstImg == null) {
            firstImg = product.image;
          }
          totalQuantity += product.qty;
        });
        order.totalQty = totalQuantity;
        order.firstImg = firstImg;
        order.totalPrice = order.totalPrice.toFixed(2);
        order.orderDate = order.orderDate.match(/(\d{4}-\d{2}-\d{2})/)[1];
      });

      res.render('orderHistory', {
        username: req.session.name,
        title: 'Order History',
        loggedIn: req.session.user,
        orders: ordersCopy
      });
    });
  }
}