const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn }= require('../lib/auth');

router.get('/', isLoggedIn, (req, res) => {
    res.render('./student/profile', {layout: 'student'});
});

router.get('/enrollment', isLoggedIn, (req, res) => {
    res.render('./student/enrollment', {layout: 'student'});
});

router.get('/schedule', isLoggedIn, (req, res) => {
    res.render('./student/schedule', {layout: 'student'});
});

router.get('/assistance', isLoggedIn, (req, res) => {
    res.render('./student/assitance_student', {layout: 'student'});
});

router.get('/payment', isLoggedIn, (req, res) => {
    res.render('./student/payment', {layout: 'student'});
});
module.exports = router;