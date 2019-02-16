module.exports = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    },
    isAdminLoggedIn(req, res, next){
        if(req.isAuthenticated() && req.user.GroupId == 1){
            return next();
        }
        return res.redirect('/profile');
    }
};