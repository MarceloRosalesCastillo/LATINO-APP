const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn }= require('../lib/auth');
const pool = require('../database');

router.get('/', isLoggedIn, (req, res) => {
    res.render('./student/profile', {layout: 'student'});
});

router.get('/enrollment', isLoggedIn, (req, res) => {
    res.render('./student/enrollment', {layout: 'student'});
});


router.post('/enrollment', isLoggedIn, async (req, res)=>{
    const {student_dni, studentaddress, studentphone, Day, Month, Year,
        nom_tut, ap_tut, address_tut, DNI, cel_tut} = req.body;
   // const {name, lastname, address, phone, age} = req.body;
    const newUser = {
        dni: student_dni,
        phone: studentphone,
        birthdate: Year + "-" + Month + "-" + Day,
        address: studentaddress,
        UserId: req.user.id
    };
    const newTutor = {
        //student_id: id_student,
        tutorname: nom_tut,
        tutorlastname: ap_tut,
        tutoraddress: address_tut,
        dni: DNI,
        tutorphone: cel_tut
    };
    //console.log(newUser);
    id = await pool.query('INSERT INTO students set ?', [newUser]);
    newTutor.StudentId = id.insertId;
    await pool.query('INSERT INTO tutors set ?', [newTutor]);

    req.flash('success', 'Estudiante registrado satisfactoriamente');
    res.redirect('/profile/payment');

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