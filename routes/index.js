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
        response.render('index', {username: obj.username});
    })
      .catch(error => {
        console.log(error);
          response.render('index');
      });
});

/*
function ensureAuthenticated (request, response, next){
  if(request.isAuthenticated()){
      console.log("Authenticated");
    return next();
  } else{
      request.flash('error_msg', 'Not Logged in');
    response.redirect('users/login');

  }
}
*/
module.exports = router;
