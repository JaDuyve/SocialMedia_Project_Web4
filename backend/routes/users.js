var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
let passport = require("passport");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    console.log(req.body)
    return res.status(400).json(
      { message: 'Please fill out all fields' });
  }
  
  let user = new User();
  user.username = req.body.username;
  user.dataPF = req.body.dataPF;
  user.contentTypePF = req.body.contentTypePF;
  user.prof = req.body.prof;
  user.setPassword(req.body.password);
  user.save(function (err, usr) {
    if (err) {
      return next(err);
    }
    return res.json({ 
      token: user.generateJWT(),
      username: usr.username,
      prof: usr.prof,
      dataPF: usr.dataPF,
      contentTypePF: usr.contentTypePF,
      _id: usr._id
    })
  });
});

router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json(
      { message: 'Please fill out all fields' });
  }
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (user) {
      return res.json({ token: user.generateJWT(), prof: user.prof });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/checkusername', function(req, res, next) {
  User.find({username: req.body.username}, 
    function(err, result) {
      if (result.length) {
        res.json({'username': 'alreadyexists'})
      } else {
        res.json({'username': 'ok'})
      }
  });
});



module.exports = router;
