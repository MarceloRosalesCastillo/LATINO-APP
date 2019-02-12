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

router.get('/checkout', isLoggedIn, (req, res) => {
    res.render('./student/checkout', {layout: 'student'});
});

router.post('/checkout/payment.json', isLoggedIn,  (req, res) => {
    console.log(req.body)
    res.json({
        object: {
            url:"https://www.multimerchantvisanet.com/formularioweb/formulariopago.asp?codtienda=522252201&amount=22&numcompra=2"
        },
        status: true,
    });
});

module.exports = router;