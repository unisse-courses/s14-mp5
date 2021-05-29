// imports
const mongoose = require('mongoose');

// config
const dbURL= "mongodb+srv://admin:1234@vanguarddb.gnxke.mongodb.net/vanguard?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

// connect and export
mongoose.connect(dbURL, options);
module.exports = mongoose;