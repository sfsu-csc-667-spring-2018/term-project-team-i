const express = require("express");
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const registerUser = require("../db/registerUser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');


router.get("/register", (request, response) => {
   response.render("register", {title: 'Register'})
});

router.post("/register", (request, response) =>{
   const username = request.body.username;
   const name = request.body.name;
   const email = request.body.email;
   const password = request.body.password;
   const password2 = request.body.password2;

   request.checkBody('username', 'User name is required').notEmpty();
   request.checkBody('name', 'Name is required').notEmpty();
   request.checkBody('email', 'Email required').notEmpty();
   request.checkBody('email', 'Email is invalid').isEmail();
   request.checkBody('password', 'Password is required').notEmpty();
   request.checkBody('password2', 'Password does not match').equals(request.body.password);


   const errors = request.validationErrors();

   if(errors)
      response.render('register', {
         errors: errors
      });
   else {
        bcrypt.hash(password, 10, (err, hash) =>{
          if(err)
             console.log(err);
          else registerUser({
              username: username,
              name: name,
              email: email,
              password: hash
          });
       });
       request.flash('success_msg', 'You are registered and can now login');
       response.redirect('/users/login');
   }
});
router.get("/login", (request, response) => {
   response.render("login", {title: "Login"});
});

passport.use(new LocalStrategy(
    (username, password, done) => {

    }
));

router.post("/login",  passport.authenticate('local',
    {successRedirect: '/', failureRedirect: '/users/login', failureFlash:true}),(request, response) =>{
    response.redirect('/');
});

router.get("/logout", (request, response) => {
});

module.exports = router;