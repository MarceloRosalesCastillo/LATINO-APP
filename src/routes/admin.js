const express = require('express');
const router = express.Router();


const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('admin/add.hbs', {layout: 'other'});
});

  
router.post('/add', isLoggedIn, async (req, res)=>{
    const {studentname, studentlastname, studentaddress, studentphone, Day, Month, Year,
        nom_tut, ap_tut, address_tut, DNI, cel_tut} = req.body;
   // const {name, lastname, address, phone, age} = req.body;
    const newUser = {
        studentname,
        studentlastname,
        studentaddress, 
        studentphone,
        bitrhdate: Year + "-" + Month + "-" + Day
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
    id = await pool.query('INSERT INTO student_data set ?', [newUser]);
    newTutor.student_id = id.insertId;
    await pool.query('INSERT INTO tutor_data set ?', [newTutor]);

    req.flash('success', 'Estudiante registrado satisfactoriamente');
    res.redirect('/admin');

});
    router.get('/', isLoggedIn, async (req, res)=>{
        const students = await pool.query('select * from student_data INNER JOIN tutor_data on student_data.id_student = tutor_data.student_id');
        res.render('admin/list',{layout: 'other', students}); 
        
    });

    router.get('/delete/:id_student', isLoggedIn, async (req, res)=>{
        const {id_student} = req.params;
        await pool.query('DELETE FROM tutor_data WHERE student_id = ?', [id_student]);
        await pool.query('DELETE FROM student_data WHERE id_student = ?', [id_student]);
        req.flash('success', 'Estudiante eliminado satisfactoriamente');
        res.redirect('/admin')
    });

    router.get('/edit/:id_student', isLoggedIn, async (req, res)=>{
        const {id_student} = req.params;
        const students = await pool.query('select * from student_data INNER JOIN tutor_data on student_data.id_student = tutor_data.student_id INNER JOIN users ON student_data.user_id = users.id WHERE student_id = ?', [id_student]);
        //const tutor = await pool.query('SELECT * FROM student_data WHERE id_student = ?', [id_student]);
        console.log(students);
        res.render('admin/edit',{layout: 'other', students: students[0]});
    });
    
    router.post('/edit/:id_student', isLoggedIn, async (req, res)=>{
        const {id_student} = req.params; 
        const {studentname, studentlastname, studentaddress, studentphone, Day, Month, Year,
            nom_tut, ap_tut, address_tut, DNI, cel_tut} = req.body;

            const newUser = {
                studentname,
                studentlastname,
                studentaddress, 
                studentphone,
                bitrhdate: Year + "-" + Month + "-" + Day
            };
            const newTutor = {
                //student_id: id_student,
                tutorname: nom_tut,
                tutorlastname: ap_tut,
                tutoraddress: address_tut,
                dni: DNI,
                tutorphone: cel_tut
            };

            await pool.query('UPDATE student_data set ? WHERE id_student = ? ', [newUser, id_student]);
            await pool.query('UPDATE tutor_data set ? WHERE student_id = ? ', [newTutor, id_student]);
            req.flash('success', 'Estudiante actualizado satisfactoriamente');
            res.redirect('/admin');
    });

  
        
module.exports = router;