const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');
// const nodemailer = require("nodemailer");
const postmark = require("postmark");

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword && user.authentication == "TRUE"){
            done(null, user, req.flash('success', 'Welcome' + user.username));
        }else if(user.authentication == "FALSE"){
            done(null, false, req.flash('message' ,'Cuenta no Verificada'));
        }else{
            done(null, false, req.flash('message' ,'Password Incorrecto'));
        }
    }else{
        return done(null, false, req.flash('message' ,'El nombre de usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {
   
    const {name, lastname, email} = req.body;
    const newUser = {
        name,
        lastname,
        username,
        email,
        password
       
    };

    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(rows.length > 0){
        const user = rows[0];
        if(user.email === email){
           return done(null, false, req.flash('message' ,'El email ya esta en uso.'));
        }
    }else{
        newUser.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ?', [newUser]);
        newUser.id = result.insertId;
        const newUserGroup = {
            UserId: newUser.id,
            GroupId: 2
            
        }
        await pool.query('INSERT INTO usergroups SET ?', [newUserGroup]);
    
        var client = new postmark.ServerClient("df3d08b3-48ef-4010-9227-016bf1ac1858");

        
        // let transporter = nodemailer.createTransport({
        //     host: "smtp.webfaction.com",
        //     port: 25,
        //     secure: false, // true for 465, false for other ports
        //     auth: {
        //       user: 'latino_mailbox_host56725a', // generated ethereal user
        //       pass: 'host56725@mail@latino1' // generated ethereal password
        //     }
        //   });
        
          var rand=Math.floor((Math.random() * 10000) + 54);
          var host='local'//req.get('host');
          var link="http://"+host+"/verify?id="+rand;
          client.sendEmail({
            "From": '"CONFIMACION DE PAGO ACADEMIA LATINO" <i1610110@continental.edu.pe>',
            "To": "i1610110@continental.edu.pe",
            "Subject": "CONFIMACION DE PAGO ACADEMIA LATINO",
            "HtmlBody": "Hola " + newUser.name + "<br> Inserta el siguiente código para terminar la verifación <br> CODE: " + rand 
        });
          
          await pool.query('UPDATE users SET code = ? where id = ?', [rand, newUser.id]);
        //   let info = await transporter.sendMail(mailOptions);
          return done(null, newUser);
    }
    
   
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    // rows = await pool.query('SELECT * FROM users WHERE users.id = ?', [id]);
    rows = await pool.query('SELECT * FROM users INNER JOIN usergroups ON users.id = usergroups.UserId WHERE users.id = ?', [id]);
    done(null, rows[0]);
});