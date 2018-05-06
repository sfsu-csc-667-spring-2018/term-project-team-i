const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../db/usersDB');

const lookup = (username, password, done) =>{
    User.loginUsername(username, (err, user) =>{
        if (err) throw err;
        if (user === null)
            return done(null, false, {message: 'Username does not exist'})
        User.loginPassword(username)
            .then(hash => {
                bcrypt.compare(password, hash.password, (err, match) =>{
                    if(err) throw err;
                    if(match){
                        console.log(hash.password);
                        console.log("password verified");
                        return done(null, user);
                    } else{
                        console.log("invalid pass");
                        return done(null, false, {message: 'Invalid Password'})
                    }
                })
            }).catch(error =>{
                console.log(error);
        })
    })
};

const strategy = new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    lookup
);




passport.serializeUser(User.serialize);
passport.deserializeUser(User.deserialize);
passport.use(strategy);

module.exports = passport;