//sendFile(path.join(__dirname, "views/index.html"))
const express = require("express");
const router = express.Router();
const pool = require('../database');

router.get("/", (req, res) => {
    res.render("./body/index.hbs");
});  

router.get("/contact", (req, res) => {
    res.render("./body/contact.hbs");
});

router.get("/about", (req, res) => {
    res.render("./body/about_us.hbs");
});

// router.get("/blog", (req, res) => {
//     res.render("./body/blog.hbs");
// }); 


module.exports = router;