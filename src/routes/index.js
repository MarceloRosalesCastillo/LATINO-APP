//sendFile(path.join(__dirname, "views/index.html"))
const express = require("express");
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn }= require('../lib/auth');

router.get("/", (req, res) => {
    res.render("./body/index.hbs");
});  

router.get("/contact", (req, res) => {
    res.render("./body/contact.hbs");
});

router.get("/about", (req, res) => {
    res.render("./body/about_us.hbs");
});

router.post("/contact", isNotLoggedIn, async (req, res) => {
    const {name, email, subject, bodymessage} = req.body;
    const newMessage = {
        name,
        email,
        subject,
        bodymessage
    }

    await pool.query('INSERT INTO messages set ?', [newMessage]);
    req.flash('success', 'Mensaje enviado satisfactoriamente');
    res.redirect('/contact')
    
});
// router.get("/blog", (req, res) => {
//     res.render("./body/blog.hbs");
// }); 


module.exports = router;