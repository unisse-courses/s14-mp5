// DB connection
const mongoose = require('./connection');

// Initialize new user schema
const profSchema = new mongoose.Schema({
  op: {type: String, required: true},
  comment: {type: String, required: true},
  recipient: {type: String, required: true}
});

// Create user object
const profModel = mongoose.model('comments', profSchema);

// Create new account
exports.create = function(object, next) {
  const comment = new profModel(object);
  comment.save(function(err, comment) {
    next(err, comment);
  });
};

// Fetch an existing account
exports.getAll = function(query, next) {
  profModel.find(query).exec(function(err, comments) {
    if(err) throw err;
    const commArray = [];
    comments.forEach(function(doc) {
      commArray.push(doc.toObject());
    });
    next(err, commArray);
  });
};