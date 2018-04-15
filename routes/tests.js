const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/", (request, response) => {
    db.any(`INSERT INTO games ("active") VALUES ('idle')`)
        .then( _ => db.any(`INSERT INTO pieces ("name", "faction") VALUES ('rook', 'white') `) )
        .then( _ => db.any (`INSERT INTO game_pieces ("gameid", "userid", "pieceid", "coordinate_x", "coordinate_y", "alive") 
    VALUES ('1', '1', '1', 'a', '5', '1')`))
        .then( _ => db.any(`SELECT * FROM game_pieces`) )
        .then( results => response.json( results ) )
        .catch( error => {
            console.log( error )

            response.json({ error })
        })
});

/*
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

//router.post("/", (request, response) =>{

//});

 */
module.exports = router;