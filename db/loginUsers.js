const db = require('../db/index');
const bcrypt = require('bcryptjs');

const loginUsername = (findUsername, callback) => {
    return db.one(`SELECT username FROM users WHERE username = ($1)`, findUsername)
        .then(data => {
            console.log(data);
            return callback(null, data);
        }).catch(error => {
            console.log(error);
            return callback(null, null);
            }
        );
};
const loginUserID = (findUserID, callback) => {
    return db.one(`SELECT id FROM users WHERE username = ($1)`, findUserID)
        .then(data => {
            console.log(data);
            return callback(null, data);
        }).catch(error => {
            console.log(error);
            return callback(null, null);
        })
};

const loginPassword = (checkUser) => {
    return db.one(`SELECT password FROM users WHERE username = ($1)`, checkUser);
    /*
        .then(data => {
            bcrypt.compare(password, data, (err, isMatch) =>{
                console.log(isMatch);
                return callback(null, isMatch);
            });
        }).catch(error => {
            console.log(error);
            return callback(null, null);
        })*/
};

module.exports = {loginUsername, loginUserID, loginPassword};
