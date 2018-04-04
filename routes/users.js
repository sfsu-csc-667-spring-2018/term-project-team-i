const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    db.any(`INSERT INTO users ("username" , "name", "password", "email") VALUES ('username1', 'name', 'pass', 'email')`)
        .then( () => db.any(`INSERT INTO users ("username" , "name", "password", "email") VALUES ('username2', 'name', 'pass', 'email')`))
        .then( _ => db.any(`SELECT * FROM users`) )
        .then( results => response.json( results ) )
        .catch( error => {
            console.log( error )
            response.json({ error })
        })
});

module.exports = router;