const express = require('express');
const router = express.Router();
const auths = require('../auth/authenticate.js');
const db = require('../db/index');

/* GET home page. */
router.get('/',auths, (request, response, next) =>{
  let getID =request.user.id;

  db.one(`SELECT username FROM users WHERE id = ${getID}`)
    .then(data=>{
        let obj = JSON.parse(JSON.stringify(data));
        //response.io.emit('userSocket', obj.username);
        response.render('index', {username: obj.username,layout: 'auth_layout.handlebars'});
    })
      .catch(error => {
        console.log(error);
          response.render('index');
      });
});

router.post("/", (request, response) =>{
    const message = request.body.message;
    console.log('POSTED MESSAGE ' + message);
    //const user = request.user.id;
    const indexRoute = response.app.get('io').of('/');
    console.log(response.app.get('io').of('/'));
    const socket = response.app.get('io');
   // console.log(socket);
    socket.on('send message', message =>{
        console.log('Chat lobby msg: ' + message);
        indexRoute.emit('new lobby message', {lobbyMsg: message});
    })

   // console.log(user);

    //response.app.get('io').of('/').emit('new lobby message', {msg:message});
    //response.sendStatus(200);
});


module.exports = router;
