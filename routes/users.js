const express = require("express");
const router = express.Router();
const db = require('../db');

router.get("/register", (request, response) => {
   response.render("register", {title: 'Register'})
});

router.post("/register", (request, response) =>{
   const username = request.body.username;

});

router.get("/login", (request, response) => {
   response.render("login", {title: "Login"});
});

router.post("/login", (request, response) =>{

});

router.get("/logout", (request, response) => {
});

module.exports = router;