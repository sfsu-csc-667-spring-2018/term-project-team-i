const db = require('../db/index');

const INSERT = `INSERT INTO users ("username", "name", "email", "password")
                    VALUES ($1, $2, $3, $4)
                    RETURNING "id", "username"`;

const registerUser  = userObject => {
    const VALUES = [userObject.username,
                    userObject.name,
                    userObject.email,
                    userObject.password];
    return db.one(INSERT, VALUES).catch(error => {
        console.log( "ERROR: ", error )
    });
};

module.exports = registerUser;
