const {body} = require('express-validator');

const loginValidation = [
  // Email should not be empty
  body('email').notEmpty().withMessage("Email is required."),
  // Email should be in valid format
  body('email').isEmail().withMessage("Please provide a valid email address."),
  // Password should not be empty
  body('password').notEmpty().withMessage("Password is required.")
];

const registerValidation = [
  // Name should not be empty
  body('name').notEmpty().withMessage("Name is required."),
  // Email should not be empty
  body('email').notEmpty().withMessage("Email is required."),
  // Email should be in valid format
  body('email').isEmail().withMessage("Please provide a valid email address."),
  // Password needs to be 8-32 characters only
  body('password').isLength({min:8, max:32}).withMessage("Password must be 8-32 characters only."),
  // Confirm password must match the initial password input
  body('confirm').custom(function(value, {req}) {
    if(value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  })
];

module.exports = {
  loginValidation,
  registerValidation
};