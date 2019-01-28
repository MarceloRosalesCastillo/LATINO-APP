const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn }= require('../lib/auth');

router.get('/', isLoggedIn, (req, res) => {
    res.render('./student/profile', {layout: 'student'});
});

router.get('/enrollment', isLoggedIn, (req, res) => {
    res.render('./student/enrollment', {layout: 'student'});
})

module.exports = router;