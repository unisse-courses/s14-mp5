// DB connection
const mongoose = require('./connection');

// Initialize new user schema
const productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  slug: {type: String},
  description: {type: String, required: true},
  category: {type: String, required: true},
  price: {type: Number, required: true},
  limited: {type: Boolean, required: true},
  hidden: {type: Boolean, required: true},
  image: {type: String, required: true}
});

// Create product object
const productModel = mongoose.model('products', productSchema);

// Create new product and upload to db
exports.create = function(object, next) {
  const product = new productModel(object);
  product.save(function(err, product) {
    if(err) throw err;
    next(err, product);
  });
};

// Fetch all products
exports.getAll = function(query, next) {
  productModel.find({}).exec(function(err, products) {
    if(err) throw err;
    const prodArray = [];
    products.forEach(function(doc) {
      prodArray.push(doc.toObject());
    });
    next(err, prodArray);
  });
};

// Fetch a product
exports.getOne = function(query, next) {
  productModel.findOne(query).exec(function(err, result) {
    if(err) throw err;
    next(err, result);
  });
};

// Fetch multiple products
exports.getMany = function(query, sort, next) {
  productModel.find(query).sort(sort).exec(function(err, products) {
    if(err) throw err;
    const prodArray = [];
    products.forEach(function(doc) {
      prodArray.push(doc.toObject());
    });
    next(err, prodArray);
  });
};

// Fetch all products by ID
exports.getAllIds = function(query, next) {
  productModel.find({'_id': {$in: query}}).exec(function(err, result) {
    if(err) throw err;
    next(err, result);
  });
};

// Fetch a product by ID
exports.getById = function(query, next) {
  productModel.findById(query).populate('_id').exec(function(err, result) {
    if (err) throw err;
    next(err, result);
  });
};

// Mark an item as limited
exports.limited = function(id, next) {
  productModel.updateOne({_id: id}, {$set: {limited: true}}, function(err,result) {
    if(err) throw err;
    next(err, result);
  });
};

// Unmark an item as limited
exports.unlimited = function(id, next) {
  productModel.updateOne({_id: id}, {$set: {limited: false}}, function(err,result) {
    if(err) throw err;
    next(err, result);
  });
};