const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

// user logs out
exports.logoutUser = function(req, res) {
  // session exists
  if(req.session) {
    req.session.destroy(function() {
      // clear session id cookie
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  }
};

// user logs in
exports.loginUser = function(req, res) {
  const errors = validationResult(req);
  // no errors
  if(errors.isEmpty()) {
    const {email, password} = req.body;
    console.log(req.body.email); // debugging
    console.log(req.body.password); // debugging

    userModel.getOne({email: email}, function(err, user) {
      if(err) {
        req.flash('error_msg', 'Something happened! Please try again.');
        res.redirect('/login');
      }
      else {
        if(user) {
          bcrypt.compare(password, user.password, function(err, result) {
            if(result) {
              req.session.user = user._id;
              req.session.name = user.name;
              res.redirect('/');
            }
          })
        }
        else {
          req.flash('error_msg', 'Invalid user credentials. Please try again.');
          res.redirect('/login');
        }
      }
    });
  }
  else {
    const messages = errors.array().map((item)=>item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/login');
  }
};

// someone creates an account
exports.registerUser = function(req, res) {
  const errors = validationResult(req);
  if(errors.isEmpty()) {
    const {name, email, password} = req.body;
    console.log(req.body.name); // debugging
    console.log(req.body.email); // debugging
    console.log(req.body.password); // debugging

    // check for existing user ? flash email address is already in use : create new user and redirect to login
    userModel.getOne({email: email}, function(err, result) {
      if(result) {
        console.log(result); // debugging
        req.flash('error_msg', 'Email address is already being used.');
        res.redirect('/register');
      }
      else {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hashed) {
          const newUser = {
            name: name,
            email: email,
            password: hashed
          };
          userModel.create(newUser, function(err, user) {
            if(err) {
              req.flash('error_msg', 'Could not create the account. Please try again');
              res.redirect('/register');
            }
            else {
              console.log(user); // debugging
              res.redirect('/login');
            }
          });
        });
      }
    });
  }
  else {
    const messages = errors.array().map((item)=>item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/register');
  }
};