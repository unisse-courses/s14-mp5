// Connects to the database via Mongoose
const mongoose = require('./connection');
const dateFormat = require('dateformat');

// Order schema
const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  cartItems: [{
    name: {type: String, required: true},
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},
    qty: {type: Number, required: true},
    image: {type: String},
    unitPrice: {type: Number, required: true},
    subPrice: {type: Number, required: true}
  }],
  deliveryAddress: {type: String, required: true},
  orderDate: {type: Date, required: true, default: Date.now()},
  status: {
    type: String, 
    required: true, 
    enum: ['Bought', 'Returned']
  },
  totalPrice: {type: Number, required: true}
});

// Create order model
const orderModel = mongoose.model('orders', orderSchema);

exports.create = function(obj, next) {
  const order = new orderModel(obj);
  order.save(function(err, order) {
    if (err) throw err;
    next(err, order);
  });
}

exports.getByQuery = function(query, next) {
  orderModel.find(query).exec(function(err, orders) {
    if (err) throw err;
    const ordersArr = [];
    orders.forEach(function(doc) {
      ordersArr.push(doc.toObject());
    });
    next(err, ordersArr);
  });
}

exports.getByID = function(id, next) {
  orderModel.findById(id).exec(function(err, order) {
    if (err) throw err;
    next(err, order.toObject());
  });
}

exports.getAll = function(query, next) {
  orderModel.find({}).exec(function(err, products) {
    if (err) throw err;
    const productObjects = [];
    i=0;
    products.forEach((doc) => {
      productObjects.push(doc.toObject());
      temp = dateFormat(productObjects[i].orderDate, "mm/dd/yyyy");
      productObjects[i].orderDate = temp;
      // console.log(temp); // testing
      i++;
    });
    next(err, productObjects);
  });
};

exports.editStatus = function(id, newStatus, next) {
  orderModel.updateOne(id, {$set: {status: newStatus}}, function(err, result) {
    if (err) throw err;
    next(err, result);
  })
};