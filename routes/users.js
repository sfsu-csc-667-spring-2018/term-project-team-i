const express = require("express");
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const User = require("../db/usersDB");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get("/register", (request, response) => {
    response.render("register", {title: 'Register'})
});

router.post("/register", (request, response) => {
    const username = request.body.username;
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password2 = request.body.password2;

    request.checkBody('username', 'User name is required').notEmpty();
    request.checkBody('name', 'Name is required').notEmpty();
    request.checkBody('password', 'Password is required').notEmpty();
    request.checkBody('password2', 'Password does not match').equals(request.body.password);


    const errors = request.validationErrors();

    if (errors)
        response.render('register', {
            errors: errors
        });
    else {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                console.log(err);
            else {
                //console.log(registerUser.checkUser({username:username}));

                User.registerUser({
                    username: username,
                    name: name,
                    email: email,
                    password: hash
                }).then(_ => {
                    request.flash('success_msg', 'You are registered and can now login');
                    response.redirect('/users/login');
                }).catch(_ => {
                    request.flash('error_msg', 'Username Taken');
                    response.redirect('/users/register')
                });

            }
        });
    }
});

router.get("/login", (request, response) => {
    response.render("login");
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.loginUsername(username, (err, user) => {
            if (err) throw err;
            if (user === null)
                return done(null, false, {message: 'Username does not exist'});
            User.loginPassword(username)
                .then(hash => {
                    bcrypt.compare(password, hash.password, (err, match) =>{
                        if(err) throw err;
                        if(match){
                            console.log(hash.password)
                            console.log("password verified");
                            return done(null, user);
                        } else{
                            console.log("invalid pass");
                            return done(null, false, {message: 'Invalid Password'});
                        }
                    })
                }).catch(error => {
                    console.log(error);
                });
            }
        )
    }));

passport.serializeUser((user, done) => {
    console.log("reached serialize");
    //console.log("user = " + user.id);
        done(null, user.username);
});

passport.deserializeUser((id, done) => {
    console.log("reached deserialize");
    console.log("id =" + id);
    User.loginUserID(id, (err, user) =>{
        if(err){
            console.log("serialize err");
        }
        console.log(id);
        done(err, user);
    });
});


router.post("/login", passport.authenticate('local',
    {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}), (request, response) => {
    //response.redirect('/');
});

router.get("/logout", (request, response) => {
    request.logout();
    request.flash('success_msg', 'You are logged out');
    response.redirect('/users/login');
});

module.exports = router;