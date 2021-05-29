// Connects to the database via Mongoose
const mongoose = require('./connection');
const productModel = require('./productModel');

// Initializes a new cart schema
const cartSchema = new mongoose.Schema({
  prod: [
    {
      id: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
      qty: {type: Number, required: true},
    }
  ],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  checkout: {type: Boolean, required: true},
  totalItems: {type: Number, required: true}
});
// Creates a cart object called `cartModel`
const cartModel = mongoose.model('cart', cartSchema);

exports.create = function(obj, next) {
  const cart = new cartModel(obj);
  cart.save(function(err, cart) {
    if (err) throw err;
    next(err, cart);
  });
};

// Get a cart by user
exports.getByUser = function(user, next) {
  cartModel.findOne({user: user}).exec(function(err, cart) {
    if (err) {
      console.log(err);
    }
    else {
      if (!cart) {
        next(err, cart);
      } 
      else {
        var prodIds = [];
        cart.prod.forEach(function (item) {
          prodIds.push(item.id);
        });
        console.log('prodIds(getbyuser model): ' + prodIds); // testing
        productModel.getAllIds(prodIds, function(err, products) {
          var totalPrice = 0;
          var subPrice;
          var prodArray = [];
          products.forEach(function (item){
            console.log('item(getbyuser model): ' + item); // for testing
            var index = cart.prod.findIndex(x => x.id.equals(item._id));
            var product = {};

            subPrice = item.price * cart.prod[index].qty;
            totalPrice += subPrice;

            product['name'] = item.name;
            product['image'] = item.image;
            product['unitPrice'] = item.price;
            product['subPrice'] = subPrice.toFixed(2);
            product['qty'] = cart.prod[index].qty;
            product['id'] = item._id;
            product['slug'] = item.slug;

            prodArray.push(product);
          });
          // console.log('before send: ' + totalPrice);
          next(err, {_id: cart._id, products: prodArray, total: totalPrice.toFixed(2)});
        });
      }
    }
  });
};

// Delete user cart
exports.deleteByuser = function(user, next) {
  cartModel.deleteOne({user: user}).exec(function(err, result) {
    if (err) throw err;
    next(err, result);
  });
};

// Add item to cart
exports.addProduct = function(filter, update, qty, next) {
  cartModel.findOne({user: filter}).exec(function(err, cart) {
    if (err) throw err;
    if (cart) {
      // console.log(cart); // for testing
      // console.log(cart.prod.some(prod => prod.id == update));
      if (!cart.prod.some(prod => prod.id == update)) {
        cart.prod.push({id: update, qty: qty})
        cart.save(next(err, cart));
      }
      else {
        var prodArray = cart.prod;
        var prodIndex = prodArray.findIndex(x => x.id == update);
        if (prodArray[prodIndex].qty + qty > 0) {
          cart.prod[prodIndex].qty += qty;
          cart.save(next(err, cart));
        }
        else {
          cart.prod.splice(prodIndex, 1);
          if (cart.prod.length == 0) {
            cartModel.deleteOne({user: filter}).exec(function(err, result) {
              next(err, result);
            });
          }
          else {
            cart.save(next(err, cart));
          }
        }
      }
      cart.totalItems = cart.totalItems + qty;
    }
    else {
      if (qty < 0) {
        throw new Error('Negative quantity when cart does not exist');
      }
      else {
        var newCart = {
          prod: [
            {
              id: update,
              qty: qty
            }
          ],
          user: filter,
          checkout: false,
          totalItems: qty
        }; 
        cartModel.create(newCart, next);
      }
    }
  });
}

// Remove item from cart
exports.removeProduct = function(filter, update, next) {
  cartModel.findOne({user: filter}).exec(function(err, cart) {
    if (err) throw err;
    if (cart) {
      // console.log(cart); // for testing
      // console.log(cart.prod.some(prod => prod.id == update));
      if (!cart.prod.some(prod => prod.id == update)) {
        next(err, cart);
      }
      else {
        var prodArray = cart.prod;
        var prodIndex = prodArray.findIndex(x => x.id == update);
        cart.totalItems = cart.totalItems - prodArray[prodIndex].qty;
        cart.prod.splice(prodIndex, 1);
        if (cart.prod.length == 0) {
          cartModel.deleteOne({user: filter}).exec(function(err, result) {
            next(err, result);
          });
        }
        else {
          cart.save(next(err, cart));
        }
      }
    }
  });
}
  
exports.deleteOne = function(id, next) {
  cartModel.deleteOne({_id: id}, function(err, result) {
    if (err) throw err;
    next(err, result);
  });
};

exports.deleteAll = function(query, next) {
  cartModel.deleteMany({}, function(err, result) {
    if (err) throw err;
    next(err, result);
  });
};