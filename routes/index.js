const express = require('express');
const router = express.Router();
const auths = require('../auth/authenticate.js');
const lobby = require('../db/lobbyDB');

/* GET home page. */
router.get('/',auths, (request, response, next) =>{
  lobby(request.user.id, response);
});

router.post("/message", (request, response) =>{
    const message = request.body.message;
    console.log('POSTED MESSAGE ' + message);
    const user = request.user.username;
    console.log(user);
    //const indexRoute = request.app.get('io').of('/');
    response.app.get('io').of('/').emit('new lobby message',
        {lobbyUser: stripHTML(user), lobbyMsg: stripHTML(message)});
});

const stripHTML = (text) =>{
    let regex = /(<([^>]+)>)/ig;
    return text.replace(regex, "");
};

module.exports = router;
