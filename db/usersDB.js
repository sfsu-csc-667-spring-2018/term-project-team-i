const db = require('../db/index');

const INSERT = `INSERT INTO users (username, name, email, password)
                    VALUES ($1, $2, $3, $4)
                    RETURNING "id", "username"`;

const registerUser  = userObject => {
    const VALUES = [userObject.username,
        userObject.name,
        userObject.email,
        userObject.password];
    return db.one(INSERT, VALUES);
};

const loginUsername = (findUsername, callback) => {
    return db.one(`SELECT username, id FROM users WHERE username = ($1)`, findUsername)
        .then(data => {
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
            return callback(null, data);
        }).catch(error => {
            console.log(error);
            return callback(null, null);
        })
};

const loginPassword = (checkUser) => {
    return db.one(`SELECT password FROM users WHERE username = ($1)`, checkUser);
};

const serialize =(user, done) => {
    done(null, user.id);
};

const deserialize = (id, done) => {
    db.one(`SELECT * FROM users WHERE id = ${id}`, {id})
        .then(({id, username}) => done(null, {id, username}))
        .catch(error => done(error));
};


module.exports = {
    registerUser,
    loginUsername,
    loginPassword,
    loginUserID,
    serialize,
    deserialize
};
