const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome' + user.username));
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
    
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    const newUserGroup = {
        UserId: newUser.id,
        GroupId: 2
        
    }
    await pool.query('INSERT INTO usergroups SET ?', [newUserGroup]);
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    rows = await pool.query('SELECT * FROM users INNER JOIN usergroups ON users.id = usergroups.UserId WHERE users.id = ?', [id]);
    done(null, rows[0]);
});