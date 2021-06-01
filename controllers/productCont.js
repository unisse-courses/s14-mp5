// imports
const productModel = require('../models/productModel');
const {validationResult} = require('express-validator');
const {productValidation} = require('../public/js/validators');
const multer = require('multer');

// prep file upload module
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
});

// add a new product
exports.addProduct = function(req, res) {
  const errors = validationResult(req);
  // console.log(req.body.name);
  // console.log(req.body.desc);
  // console.log(req.body.categ);
  // console.log(req.body.price);
  // console.log(errors);
  if(errors.isEmpty()) {
    // prep product info
    var image;
    var {name, desc, categ, price} = req.body;
    var slug = req.body.name.replace(/\s+/g, '-').toLowerCase();

    if(req.file == undefined || req.file == null || req.file == "") {
      req.flash('error_msg', "Please upload an image.");
      res.redirect('/add_new_product');
    }
    else {
      image = req.file;
      if(image == undefined || image == null || image == "") {
        image = 'images/Vanguard.png';
      }
      else {
        image = "/uploads/" + req.file.originalname;
      }
    }

    productModel.getOne({slug: slug}, function(err, result) {
      if(result) {
        req.flash('error_msg', 'Product already exists.');
        res.redirect('/add_new_product');
      }
      else {
        const newProduct = {
          seller: req.session.name,
          name: name,
          slug: slug,
          description: desc,
          category: categ,
          price: Math.round(price*100)/100.0,
          limited: false,
          hidden: false,
          image: image
        };
        console.log(newProduct);
        productModel.create(newProduct, function(err, product) {
          if(err) {
            console.log("Fail");
            req.flash('error_msg', 'Could not create product.');
            res.redirect('/add_new_product');
          }
          else {
            console.log("Pass");
            req.flash('success_msg', 'Successfully added a new product.')
            res.redirect('/add_new_product');
          }
        });
      }
    });
  }
  else {
    const messages = errors.array().map((item)=>item.msg);
    req.flash('error_msg', messages.join(' '));
    res.redirect('/add_new_product');
  }
};

// edit a product
exports.editProduct = (req, res) => {
  // fetch product info
  var image;
  var {name, desc, categ, price} = req.body;
  var slug = req.body.name.replace(/\s+/g, '-').toLowerCase();
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, (err, product) => {
    if(err) {
      req.flash('error_msg', "Product not found.");
      res.redirect('/view_all_products');
    }
    else {
      if(product) {
        if(name == "") {
          name = product.name;
          slug = product.slug;
        }
        if(desc == "") {
          desc = product.description;
        }
        if(categ == "") {
          categ = product.category;
        }
        if(price == "") {
          price = product.price;
        }
        else {
          price = Math.round(price*100)/100.0;
        }
        if(req.file == undefined || req.file == null || req.file == "") {
          image = product.image;
        }
        else {
          image = "/uploads/" + req.file.originalname;
        }

        productModel.updateItem(product_id, name, slug, desc, categ, price, image, function(err, result) {
          if(err) {
            req.flash('error_msg', "There was a problem in updating the product details.");
            res.redirect('/edit_product/' + product_id);
          }
          else {
            req.flash('success_msg', "Successfully updated product details of " + name + ".");
            res.redirect('/edit_product/' + product_id);
          }
        });
      }
    }
  });
};

// This functions gets all the products from the database 
exports.getAllProducts = function(req, res) {
  var query = {hidden: false};
  var sort = {name: 1};
  if (req.body.category && req.body.category != 'No Filter') {
    query.category = req.body.category;
  }

  if (req.body.sort && req.body.sort != 'name') {
    if (req.body.sort == "asc") {
      sort = {price: 1, name: 1}
    }
    else {
      sort = {price: -1, name: 1};
    }
  }
  console.log('---');
  productModel.getMany(query, sort, function(err, products) {
    var categories = [];
    products.forEach(function(item) {
      if (!categories.includes(item.category)) {
        categories.push(item.category);
      }
    });

    console.log(products);
    res.render('marketplace', {
      username: req.session.name,
      title: 'Marketplace',
      products: products,
      loggedIn: req.session.user,
      categories: categories
    });
  });
};

// refresh product list
exports.refreshProducts = function(req, res) {
  var query = {hidden: false};
  var sort = {name: 1};
  if (req.body.category && req.body.category != 'No Filter') {
    query.category = req.body.category;
  }
  if (req.body.name && req.body.name != '') {
    query.name = {$regex: '.*' + req.body.name + '.*'};
  }
  
  if (req.body.sort && req.body.sort != 'name') {
    if (req.body.sort == "asc") {
      sort = {price: 1, name: 1}
    }
    else {
      sort = {price: -1, name: 1};
    }
  }
  console.log('---');
  productModel.getMany(query, sort, function(err, products) {
    var categories = [];
    products.forEach(function(item){
      if (!categories.includes(item.category)) {
        categories.push(item.category);
      }
    });

    console.log(products);
    res.render('products', {
      layout: null,
      products: products,
    });
  });
};

// Get a product then display its details
exports.getAProduct = function(req, res) {
  productModel.getOne({slug: req.params.slug}, function(err, product) {
    if(err) {
      console.log(err);
    }
    else {
      res.render('productDetails', {
        title: product.name,
        username: req.session.name,
        name: product.name,
        desc: product.description,
        image: product.image,
        price: product.price,
        _id: product._id,
        loggedIn: req.session.user,
      });
    }
  });
}

// Get user's product listing
exports.getMyProducts = function(req, res) {
  productModel.getMany({seller: req.session.name}, {name: 1}, function(err, products) {
    products.forEach(function(item) {
      item.price = (item.price).toFixed(2);
    })
    res.render('viewListing', {
      username: req.session.name,
      title: 'My Products',
      products: products,
      loggedIn: req.session.user
    });
  });
};

// Hide a product
exports.hideItem = function(req, res) {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, function(err, product) {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/view_listing');
    }
    else {
      productModel.hide(product_id, function(err, result) {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/view_listing');
        }
        else {
          req.flash('success_msg', "Successfully hidden an item!");
          res.redirect('/view_listing');
        }
      });
    }
  });
};

// Unhide a product
exports.unhideItem = function(req, res) {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, function(err, product) {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/view_listing');
    }
    else {
      productModel.unhide(product_id, function(err, result) {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/view_listing');
        }
        else {
          req.flash('success_msg', "Successfully unhidden an item!");
          res.redirect('/view_listing');
        }
      });
    }
  });
};

// Mark a product as limited
exports.limitedItem = function(req, res) {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, function(err, product) {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/view_listing');
    }
    else {
      productModel.limited(product_id, function(err, result) {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/view_listing');
        }
        else {
          req.flash('success_msg', "Successfully marked an item as limited!");
          res.redirect('/view_listing');
        }
      });
    }
  });
};

// Unmark a product as limited
exports.unlimitedItem = function(req, res) {
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, function(err, product) {
    if(err) {
      req.flash('error_msg', "Something went wrong. Please try again.");
      res.redirect('/view_listing');
    }
    else {
      productModel.unlimited(product_id, function(err, result) {
        if(err) {
          req.flash('error_msg', "Something went wrong. Please try again.");
          res.redirect('/view_listing');
        }
        else {
          req.flash('success_msg', "Successfully unmarked an item as limited!");
          res.redirect('/view_listing');
        }
      });
    }
  });
};

// Delete a Product
exports.deleteProduct = function(req, res) {
  var product_id = req.params._id;
  productModel.getOne({_id: product_id}, function(err, product) {
    if(err) {
      console.log(err);
    }
    else {
      productModel.removeProduct({_id: product_id}, function(err, product) {
        if(err) {
          console.log(err);
        }
        else {
          req.flash('success_msg', 'Successfully removed a product!');
          res.redirect('/view_listing');
        }
      })
    }
  });
};

// Get a product then display its details
exports.getProduct = function(req, res) {
  var product_id = req.params._id;
  productModel.getById({_id: product_id}, function(err, product) {
    if(err) {
      console.log(err);
    }
    else {
      res.render('editProduct', {
        title: 'Edit Product Details',
        id: product_id,
        name: product.name,
        desc: product.description,
        categ: product.category,
        price: product.price,
        image: product.image,
        username: req.session.name,
        loggedIn: req.session.user
      });
    }
  });
};

// Edit a Product
exports.editProduct = function(req, res) {
  var image;
  var {name, desc, categ, price} = req.body;
  var slug = req.body.name.replace(/\s+/g, '-').toLowerCase();
  var product_id = req.params._id;

  productModel.getOne({_id: product_id}, function(err, product) {
    if(err) {
      req.flash('error_msg', "Product not found.");
      res.redirect('/view_listing');
    }
    else {
      if(product) {
        if(name == "") {
          name = product.name;
          slug = product.slug;
        }
        if(desc == "") {
          desc = product.description;
        }
        if(categ == "") {
          categ = product.category;
        }
        if(price == "") {
          price = product.price;
        }
        else {
          price = Math.round(price * 100) / 100.0;
        }
        if(req.file == undefined || req.file == null || req.file == "") {
          image = product.image;
        }
        else {
          image = "/uploads/" + req.file.originalname;
        }

        productModel.updateItem(product_id, name, slug, desc, categ, price, image, function(err, result) {
          if(err) {
            req.flash('error_msg', "There was a problem updating product details. Please try again.");
            res.redirect('/edit_item/' + product_id);
          }
          else {
            req.flash('success_msg', "Successfully updated product details of " + name + ".");
            res.redirect('/edit_item/' + product_id);
          }
        });
      }
    }
  });
};

// display limited product
exports.displayLimitedItems = function(req, res) {
  productModel.getMany({limited: true, hidden: false}, {pName: 1}, function(err, products) {
    res.render('home', {
      username: req.session.name,
      title: 'Vanguard',
      desc: 'Specialized store in supplying hunters with quality equipment and items for missions',
      img: '/images/Vanguard.png',
      alt_text: 'Vanguard Logo',
      products: products,
      loggedIn: req.session.user
    });
  })
}