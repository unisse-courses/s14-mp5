// imports
const router = require('express').Router();
const userController = require('../controllers/userCont');
const {loginValidation, registerValidation} = require('../public/js/validators.js')
const {isPublic, isPrivate} = require('../middlewares/auth.js');

// public routes
// Login GET method
router.get('/login', isPublic, function(req, res) {
  res.render('login', {
    title: 'Sign In',
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  });
});

// Contact Us GET method
router.get('/contact_us', isPublic, function(req, res) {
  res.render('contact_us', {
    title: 'Contact Us',
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  });
});

// Register GET method
router.get('/register', isPublic, function(req, res) {
  res.render('register', {
    title: 'Create Account',
    img: '/images/Vanguard.png',
    alt_text: 'Vanguard Logo',
  });
});

// form submissions
router.post('/login', isPublic, loginValidation, userController.loginUser);
router.post('/register', isPublic, registerValidation, userController.registerUser);

// private routes
// Logout GET method
router.get('/logout', isPrivate, userController.logoutUser);

// export entire module
module.exports = router;