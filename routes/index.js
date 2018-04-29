const express = require('express');
const router = express.Router();
const auths = require('../auth/authenticate.js');
/* GET home page. */
router.get('/',auths, (request, response, next) =>{
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
