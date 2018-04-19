const db = require('../db/index');

const SELECT = `SELECT * FROM users WHERE username = $1`;

const loginUser = (username, callback) => {
    const VALUES = username;
    db.one(SELECT, VALUES).then(data => {
        return callback(data,null)
    }).catch(error => {
        callback(null, error);
        console.log("invalid user ", error);
    });
};

module.exports = loginUser;
