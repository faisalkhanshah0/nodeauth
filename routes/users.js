var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Signup' });
});

router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.cpassword;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'UserName is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('cpassword', 'Password do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors)
  { 
    console.log('Yes there is some error.');
  }
  else{
    console.log('No errors');
  }
  
});

router.get('/login', function(req, res, next){
  res.render('login', { title: 'Login' });
});


module.exports = router;
