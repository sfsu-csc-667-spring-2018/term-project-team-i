
const ensureAuth = (request, response, next) =>{
    if (request.isAuthenticated()) {
        return next();
    } else {
        request.flash('error_msg', 'Not Logged in');
        response.redirect('/users/login');
    }
};


module.exports = ensureAuth;