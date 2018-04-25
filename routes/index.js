const express = require('express');
const router = express.Router();
const Authenticate = require('../auth/authenticate.js');
const auths = new Authenticate();
/* GET home page. */
router.get('/',auths.ensureAuth, (request, response, next) =>{
  response.render('index');
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
