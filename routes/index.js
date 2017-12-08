var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var mongoose = require('mongoose');
var expressSession = require('express-session');
var Sticky = mongoose.model('Sticky');
var users = require('../controllers/users_controller');
var path = require('path');

router.get('/sticky', function(req, res, next) {
  if(verifyUser(req,res)){
    //console.log("in get");
    Sticky.find({"username" : req.session.username}, function(err, sticky) {
      //console.log("in get again");
      if (err) { return next(err); }
      res.json(sticky);
    });
  }
});

router.post('/sticky', function(req, res, next) {
  if(verifyUser(req,res)){
    var sticky = new Sticky(req.body);
    sticky.setUsername(req.session.username, function(err, sticky){
      if(err) {return next(err); }
      sticky.save(function(err, sticky) {
        if (err) { return next(err); }
        res.json(sticky);
      });
    });
  }
});

router.param('sticky', function(req, res, next, id) {
  if(verifyUser(req,res)){
    var query = Sticky.findById(id);
    query.exec(function(err, sticky) {
      if (err) { return next(err); }
      if (!sticky) { return next(new Error("can't find sticky")); }
      req.sticky = sticky;
      return next();
    });
  }
});

router.put('/sticky/:sticky/color', function(req, res, next) {
  if(verifyUser(req,res)){
  req.sticky.changeColor(req.color, function(err, sticky) {
    if (err) { return next(err); }
    res.json(sticky);
   });
  }
});

router.put('/sticky/:sticky/size', function(req, res, next) {
  if(verifyUser(req,res)){
    req.sticky.changeSize(req.body.height, req.body.width, function(err, sticky) {
      if (err) { return next(err); }
      res.json(sticky);
    });
  }
});

router.put('/sticky/:sticky/loc', function(req, res, next) {
  if(verifyUser(req,res)){
    req.sticky.changeLoc(req.body.top, req.body.left, function(err, sticky) {
      if (err) { return next(err); }
      res.json(sticky);
    });
  }
});

router.put('/sticky/:sticky/text', function(req, res, next) {
  if(verifyUser(req,res)){
    req.sticky.changeText(req.body.text, function(err, sticky) {
      if (err) { return next(err); }
      res.json(sticky);
    });
  }
});

router.delete('/sticky/:sticky', function(req, res) {
  if(verifyUser(req,res)){
    req.sticky.remove();
    res.sendStatus(200);
  }
});

router.delete('/sticky', function(req, res, next) {
  if(verifyUser(req,res)){
    Sticky.remove({"username" : req.session.username},function(err){
      if(err) {return next(err)}
      res.sendStatus(200);
    });
  } 
});

var verifyUser = function(req, res) {
  if(!req.session.user){
    res.sendFile(path.join(process.cwd(), 'public/auth.html'));
    return false;
  }
  return true;
}

//console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("/ Route if user");
      res.sendFile(path.join(process.cwd(), 'public/index.html'));
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
      res.redirect('/');
    }
    else res.redirect('/login');
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
      res.sendFile(path.join(process.cwd(), 'public/index.html'));
    }
    res.sendFile(path.join(process.cwd(), 'public/auth.html'));
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
router.post('/signup', users.signup);
router.post('/login', users.login);

router.get('/index.html', function(req,res){
  res.redirect("/");
})

module.exports = router;
