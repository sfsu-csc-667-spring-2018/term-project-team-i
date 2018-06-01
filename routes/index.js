const express = require('express');
const router = express.Router();
const auths = require('../auth/authenticate.js');
const lobby = require('../db/lobbyDB');

/* GET home page. */
router.get('/',auths, (request, response, next) =>{
  lobby(request.user.id, response);
});

router.post("/message",auths, (request, response) =>{
    const message = request.body.message;
    const user = request.user.username;

    response.app.get('io').of('/').emit('socket-chat-message',
        {chatUser: stripHTML(user), chatMessage: stripHTML(message)});

    response.statusCode = 200;
    response.end();
});

const stripHTML = (text) =>{
    let regex = /(<([^>]+)>)/ig;
    return text.replace(regex, "");
};

module.exports = router;
