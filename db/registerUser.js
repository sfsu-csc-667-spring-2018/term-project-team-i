const db = require('../db/index');

const INSERT = `INSERT INTO users ("username", "name", "email", "password")
                    VALUES ($1, $2, $3, $4)
                    RETURNING "id", "username"`;
const checkUser = checkUsernameObj => {
    const username = checkUsernameObj.username;
    return db.one(`SELECT username FROM users WHERE username = ($1)`, username);
};

const registerUser  = userObject => {
    const VALUES = [userObject.username,
        userObject.name,
        userObject.email,
        userObject.password];
    return db.one(INSERT, VALUES);
};

module.exports = {registerUser, checkUser};
