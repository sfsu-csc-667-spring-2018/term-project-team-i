const express = require('express');
const router = express.Router();
const auths = require('../auth/authenticate.js');
const db = require('../db/index');

/* GET home page. */
router.get('/',auths, (request, response, next) =>{
  let getID =request.user.id;

  db.tx(t =>{
      const user = t.one(`SELECT username FROM users WHERE id = ${getID}`);
      const games = t.any(`SELECT id FROM games WHERE active = 'active'`);
      return t.batch([user, games]);
  }).then( data =>{
      console.log("reached data"  + JSON.stringify(data));
      let obj = JSON.parse(JSON.stringify(data[0]));
      let game = JSON.parse(JSON.stringify(data[1]));
      response.render('index', {username: obj.username, game: game,layout: 'auth_layout.handlebars'});
  }).catch(error => {
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
