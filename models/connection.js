// imports
const mongoose = require('mongoose');
const {dbURL} = require('../config');

// config
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

// connect and export
mongoose.connect(dbURL, options);
module.exports = mongoose;