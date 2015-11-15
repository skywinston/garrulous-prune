var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/reddit-clone');
var bcrypt = require('bcrypt');
var cookieSession = require('cookie-session');
var Users = db.get('users');

// RIGHT NOW THIS IS SERVING UP THE INDEX TO MY INITIAL CALL TO GET ALL POSTS
// router.route('/')
// .get(function(req, res, next){
//   if(!req.user){
//     return res.render('login');
//   } else {
//     res.sendFile('index.html', {
//       root: __dirname + '/../public/'
//     });
//   }
// });
//
// router.route('login')
// .get(function(req, res, next){
//   res.render('login');
// })
// .post(function(req, res){
//   var errors = [];
//   Users.findOne({username: req.body.username}).then(function(user){
//     console.log("Found the user you were looking for:", user);
//     if(!bcrypt.compareSync(req.body.password, user.passwordDigest)){
//       errors.push('Incorrect username/password');
//     }
//     // User exists. Compare hashed password with passwordDigest.
//     if(bcrypt.compareSync(req.body.password, user.passwordDigest)){
//       // Passwords match.  Set the session and redirect to /students.
//       req.session.user = user;
//       res.redirect('/');
//     }
//
//     if(errors.length){
//       res.render('login', {errors: errors});
//     }
//   })
// })
//
// router.route('register')
// .get(function(req, res, next){
//   res.render('register');
// })
// .post(function(req, res, next){
//   var errors = [];
//   User.findOne( {username: req.body.username}, function(err, user){
//     if(user){
//       console.log("I found a user in the DB", user);
//       errors.push("User already exists");
//     }
//     else if (!user){
//       console.log("No user found!");
//       // Failure conditions
//       if(!req.body.username || !req.body.password || !req.body.passwordConfirm){
//         errors.push("All fields are required");
//       } else if (req.body.password !== req.body.passwordConfirm){
//         errors.push("Passwords do not match");
//       }
//       // Succcess conditions
//       if(req.body.username.length > 0 && req.body.password == req.body.passwordConfirm){
//         var hash = bcrypt.hashSync(req.body.password, 10);
//         User.create( {username: req.body.username, passwordDigest: hash}, function(err, user){
//           console.log("This is the newly created user", user);
//
//           req.session.user = user;
//           res.render('students', {user : req.session.user});
//         });
//       }
//     }
//
//     if(errors.length){
//       res.render('register', {errors : errors});
//     }
//   });
// })

router.get('*', function(req, res, next){
  if(!req.user){
    res.render('login');
  } else {
    res.sendFile('index.html', {
      root: __dirname + '/../public/'
    });
  }
});

module.exports = router;
