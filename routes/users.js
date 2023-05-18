const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Equipment = require('../models/equipment');
const multer = require('multer');
const fs = require('fs-extra');
const path = require("path");




// Validation registeration schema
const userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    phone: Joi.string().regex(/^05\d{8}$/).required(),
    username: Joi.string().regex(/^[A-Za-z]{3,10}$/).required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/).required(),
    confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
  });
  // Validation login schema
  const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,20}$/).required()
  });
//   Routing to register
router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post(async (req, res, next) => {
    try {
      const result = userSchema.validate(req.body);
      if (result.error) {
        req.flash('error', 'Data entered is not valid. Please try again.');
        res.redirect('/users/register');
        return;
      }
      const user = await User.findOne({ 'email': result.value.email });
      if (user) {
        req.flash('error', 'Email is already in use.');
        res.redirect('/users/register');
        return;
      }
      const usernameCheck = await User.findOne({ 'username': result.value.username });
      if (usernameCheck) {
        req.flash('error', 'Username is already in use.');
        res.redirect('/users/register');
        return;
      }
      const hash = await User.hashPassword(result.value.password);
      delete result.value.confirmationPassword;
      result.value.password = hash;
      
      const newUser = await new User(result.value);
      await newUser.save();

      req.flash('success', 'Registration successfully, go ahead and login.');
      res.redirect('/users/login');

    } catch(error) {
        next(error)
      }
    });

    // global.userId = 0;
    // global.userName = 0;

    // Routing to login
    router.route("/login")
    .get((req, res) => {
      if(req.session.isAuth == undefined)
      res.render("login");
      else{
      req.flash("error", "Already Logged in");  
      res.redirect("/users/dashboard");
      }
    }).post(async (req, res, next) => {
      try {
        const result = loginSchema.validate(req.body);
        if (result.error) {
          req.flash('error', 'Email/Password is not valid. Please try again.');
          res.redirect('/users/login');
          return;
        }
        var user = await User.findOne({ 'email': result.value.email });
        if (user) {
          let passwordIsValid = bcrypt.compareSync(
            result.value.password,
            user.password
          );
          if (!passwordIsValid) {
            req.flash('error', 'Email/Password is not valid. Please try again.');
            res.redirect('/users/login');
            return;
          }
          if(req.session.eqId == undefined){
          req.session.userId = user._id;
          req.session.userName = user.username;
          req.session.isAuth = true;
          req.flash('success', 'Login successfully Welcome ' + req.session.userName);
          res.redirect('/users/dashboard');
          }
          else{
          let equipmentInInfo = await Equipment.findOne({_id: req.session.eqId});
          req.session.userId = user._id;

         if(equipmentInInfo.state == "Busy"){
          req.session.userName = user.username;
          req.session.isAuth = true;
          req.flash('success', 'Login successfully Welcome ' + req.session.userName);
          res.redirect('/users/dashboard');
         }
          else if(equipmentInInfo.ownerId != req.session.userId){
          req.session.userName = user.username;
          req.session.isAuth = true;
          req.flash('success', 'Login successfully Welcome ' + req.session.userName);
          res.redirect('/equipments/info?equipmentId=' + req.session.eqId);
          }
          

          else{
          req.session.userName = user.username;
          req.session.isAuth = true;
          req.flash('success', 'Login successfully Welcome ' + req.session.userName);
          res.redirect('/users/dashboard');
          
          }

          }
        }
        else {
          req.flash("error", "Email/Password is not valid. Please try again");
          res.redirect('/users/login');
        }
      } catch (error) {
        next(error);
      }
    });

// Logout routing
router.get("/logout", (req, res) => {
  if(req.session.isAuth == true){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("success", "Logged out Successfully");
    res.redirect('/users/dashboard');
  });
}
else {
  req.flash("error", "Not logged in");
  res.redirect("/users/dashboard");
} 
});

// Processing Picture
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/uploads')
    },
    filename: (req, file, cb) => {
      let filename = 'pic';
      req.body.file = filename;
 
     cb(null, filename);
    }
});
 

const upload = multer({ dest: 'uploads/' });



//To save the Equipment in the database, Firstly in obj object 
// Upload Routing
router.post('/upload', upload.single('pic'), async (req, res, next) => {
  var obj = {
      pname: req.body.pname,
      desc: req.body.desc,
      price: req.body.price,
      insurance: req.body.insurance,
      location: req.body.location,
      tag: req.body.tag,
      delivery: req.body.deliveryOpt,
      state: "Available",
      ownerId: req.session.userId, 
      pic: {
        //  data: fs.readFileSync(__dirname + '/uploads/' + req.body.pic).toString("base64"),
        data: fs.readFileSync(req.file.path).toString('base64'),
          contentType: 'image/*'
      }
  }
  try {
    // Save in database line 191 192 
    // obj in database
  const newEquipment = await new Equipment(obj);
  await newEquipment.save();
  req.flash('success', 'Equipment Uploaded Successfully, you can find it in your profile');
  res.redirect('/users/dashboard');
  } catch(error) {
    next(error);
  }
});






// Profile Router
router.get("/profile", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({ownerId: req.session.userId}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data, userNameProfile: req.session.userName});
    }  
    }).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});

// profile filter start

router.get("/profile/lowest", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({ownerId: req.session.userId}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data});
    }  
    }).sort({price: 1}).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});

router.get("/profile/highest", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({ownerId: req.session.userId}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data});
    }  
    }).sort({price: -1}).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});

router.get("/profile/cameras", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({$and: [{tag: "camera"}, {ownerId: req.session.userId}]}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data});
    }  
    }).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});

router.get("/profile/flashes", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({$and: [{tag: "flash"}, {ownerId: req.session.userId}]}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data});
    }  
    }).sort({price: 1}).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});

router.get("/profile/lenses", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({$and: [{tag: "lenses"}, {ownerId: req.session.userId}]}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data});
    }  
    }).sort({price: 1}).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});

router.get("/profile/others", (req, res) => {
  if(req.session.isAuth == true) {
  try {  
    Equipment.find({$and: [{tag: "others"}, {ownerId: req.session.userId}]}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("profile", {data: data});
    }  
    }).sort({price: 1}).lean();  
    } catch (error) {  
    console.log(error);  
    } 
  }
  else{
  req.flash("error", "You have to login");
  res.redirect("/users/login");
  }
});



// profile filter end


    module.exports = router;