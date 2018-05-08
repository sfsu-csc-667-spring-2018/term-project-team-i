
const ensureAuth = (request, response, next) =>{
    if (request.isAuthenticated()) {
        console.log("Authenticated");
        return next();
    } else {
        request.flash('error_msg', 'Not Logged in');
        response.redirect('/users/login');
    }
};


module.exports = ensureAuth;