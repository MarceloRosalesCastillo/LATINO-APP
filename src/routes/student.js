const express = require('express');
const router = express.Router();
const paypal = require("paypal-rest-sdk");
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, (req, res) => {
    res.render('./student/profile', { layout: 'student' });
});

router.get('/enrollment', isLoggedIn, (req, res) => {
    res.render('./student/enrollment', { layout: 'student' });
});

router.get('/schedule', isLoggedIn, (req, res) => {
    res.render('./student/schedule', { layout: 'student' });
});

router.get('/assistance', isLoggedIn, (req, res) => {
    res.render('./student/assitance_student', { layout: 'student' });
});

router.get('/checkout', isLoggedIn, (req, res) => {
    res.render('./student/checkout', { layout: 'student' });
});

router.post('/checkout/payment.json', isLoggedIn, (req, res) => {
    paypal.configure({
        'mode': 'sandbox',
        'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
        'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
    });
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://return.url",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            Link = payment.links[1].href;
            console.log(Link);
            res.json({
                object: {
                    url: Link
                },
                status: true,
            });            
        }
    });
    

});

module.exports = router;