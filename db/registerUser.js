const db = require('../db/index');

const INSERT = `INSERT INTO users ("username", "name", "email", "password")
                    VALUES ($1, $2, $3, $4)
                    RETURNING "id", "username"`;
const checkUser = (checkUsernameObj) => {
    const username = checkUsernameObj.username;
    let counter = 0;
    db.one(`SELECT COUNT(*) FROM users WHERE username = ($1)`, username, c => +c.count)
        .then(count => {
            console.log(count);
        }).catch(error => console.log(error));
    return counter;
};

const registerUser  = userObject => {
    const VALUES = [userObject.username,
        userObject.name,
        userObject.email,
        userObject.password];
    return db.one(INSERT, VALUES).catch(error => {
        console.log( "ERROR: ", error );
    });
};

module.exports = {registerUser, checkUser};
