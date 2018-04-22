const express = require("express");
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const registerUser = require("../db/registerUser");
const login = require("../db/loginUsers");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');


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
    //request.checkBody('email', 'Email required').notEmpty();
    //request.checkBody('email', 'Email is invalid').isEmail();
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

                registerUser.registerUser({
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
    response.render("login", {title: "Login"});
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        login.loginUsername(username, (err, user) => {
            if (err) throw err;
            if (user === null) return done(null, false, {message: 'Username does not exist'})
        });
        login.loginPassword(username)
            .then(hash => {
                console.log(hash);
                console.log(password);
                bcrypt.compare(password, hash)
                    .then(_ => {
                        return done(null, user);
                    })
                    .catch(_ => {
                        return done(null, false, {message: 'Invalid Password'});
                    });
            }).catch(error=>{
                console.log(error);
        })

        //else return done(null, false, {message: 'Invalid Password'});
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    //login.loginUserID(id, (err, user) =>{
    // done(err, user);
    //});
});

router.post("/login", passport.authenticate('local',
    {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}), (request, response) => {
    response.redirect('/');
});

router.get("/logout", (request, response) => {
    request.logout();

    request.flash('success_msg', 'You are logged out');
});

module.exports = router;