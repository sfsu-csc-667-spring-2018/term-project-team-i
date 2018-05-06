const express = require("express");
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const User = require("../db/usersDB");
const passport = require('../auth');
//const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get("/register", (request, response) => {
    response.render("register", {layout: 'layout.handlebars'})
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
    response.render("login",  {layout: 'layout.handlebars'});
});

router.post("/login", passport.authenticate('local',
    {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}));

router.get("/logout",(request, response) => {
    request.logout();
    request.flash('success_msg', 'You are logged out');
    response.redirect('/users/login');
});

module.exports = router;