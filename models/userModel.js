// DB connection
const mongoose = require('./connection');

// Initialize new user schema
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, min: 8, required: true}
});

// Create user object
const userModel = mongoose.model('users', userSchema);

// Create new account
exports.create = function(object, next) {
  const user = new userModel(object);
  user.save(function(err, user) {
    next(err, user);
  });
};

// Fetch an existing account
exports.getOne = function(query, next) {
  userModel.findOne(query, function(err, user) {
    next(err, user);
  });
};