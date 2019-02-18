const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn }= require('../lib/auth');

router.get("/signup", isNotLoggedIn, (req, res) => {
    res.render("./student/signup.hbs");
}); 

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
        successRedirect: '/authentication',
        failureRedirect: '/signup',
        failureFlash: true
}));
   
router.get("/signin", isNotLoggedIn, (req, res) => {
    res.render("./student/signin.hbs");
}); 

router.post("/signin", isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })
   
    (req, res, next);
   
    // else{
    //     passport.authenticate('local.signin', {
    //         successRedirect: '/admin',
    //         failureRedirect: '/signin',
    //         failureFlash: true
    //     });
    // }
}); 



router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;
