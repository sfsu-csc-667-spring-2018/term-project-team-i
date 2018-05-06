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

router.post("/message", (request, response) =>{
    const message = request.body.message;
    console.log('POSTED MESSAGE ' + message);
    const user = request.user.username;
    console.log(user);
    //const indexRoute = request.app.get('io').of('/');
    response.app.get('io').of('/').emit('new lobby message',
        {lobbyUser: user, lobbyMsg: message});
});


module.exports = router;
