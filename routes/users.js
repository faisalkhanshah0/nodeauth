var express = require('express');
var router = express.Router();
var { Users, createUser, getUserByUsername, comparePassword, getUserById } = require('./../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
    res.render('register', { errors : errors, title : 'Signup'});
  }
  else{
    var newUser = new Users({
      name,
      email,
      username,
      password
    });

    createUser(newUser, (err, user) => {
      if(err)
      {
        throw err;
      }
      console.log('user');
    });

    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('/users/login');
  }
  
});

router.get('/login', function(req, res, next){
  res.render('login', { title: 'Login' });
});

passport.serializeUser(function(user, done) {
  // console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  getUserById(id, function(err, user) {
    // console.log(user);
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    // Users.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });

    getUserByUsername(username, (err, user) => {
      if(err)
      {
        throw err;
      }
      if(!user){
        return done(null, false, { message : 'Unknown User'});
      }
      comparePassword(password, user.password, (err, isMatch) => {
        if(err)
        {
          throw err;
        }
        if(!isMatch){
          return done(null, false, { message : 'Incorrect Password'});
        }

        return done(null, user);
      });
    });
  }
));

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/users/login', failureFlash : true }),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/'+ req.user.username);
  });

  router.get('/logout',
  function(req, res) {
    req.logOut(); // formerly i have tried it with logout()
    // req.session.destroy();
    req.flash('success_msg', 'You have successfully Logout.');
    res.redirect('/users/login');
  });

module.exports = router;
