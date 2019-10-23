const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');
const paypal = require('paypal-rest-sdk');
const postmark = require("postmark");

const datenow = new Date(Date.now()).toLocaleString();
var idorder = "";

router.get('/', isLoggedIn, async (req, res) => {
  o = await pool.query("SELECT status, date FROM enrollments WHERE UserId = ? ORDER BY date DESC", [req.user.UserId]);
  // console.log(o);
  if (req.user.GroupId == 2 && (o.length <= 0 || o[0].status == "OFF")) {
    res.render('./student/studentprofile', { layout: 'student' });
  } else if (req.user.GroupId == 2 && o[0].status == "ON") {
    res.render('./student/studentprofile', { layout: 'studentenrollment' });
  } else {
    res.redirect('/admin');
  }
});


router.get('/enrollment', isLoggedIn, (req, res) => {
  res.render('./student/enrollment', { layout: 'student' });
});


router.post('/enrollment', isLoggedIn, async (req, res) => {
  const { student_dni, studentaddress, studentphone, Day, Month, Year,
    nom_tut, ap_tut, address_tut, DNI, cel_tut } = req.body;
  // const {name, lastname, address, phone, age} = req.body;
  const newUser = {
    dni: student_dni,
    phone: studentphone,
    birthdate: Year + "-" + Month + "-" + Day,
    address: studentaddress,
    UserId: req.user.UserId
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
  res.redirect('/profile/checkout');

});

router.get('/schedule', isLoggedIn, async (req, res) => {
  o = await pool.query("SELECT status, date FROM enrollments WHERE UserId = ? ORDER BY date DESC", [req.user.UserId]);

  if (req.user.GroupId == 2 && (o.length <= 0 || o[0].status == "OFF")) {
    res.render('./student/schedule', { layout: 'student' });
  } else {
    res.render('./student/schedule', { layout: 'studentenrollment' });
  }

});

router.get('/assistance', isLoggedIn, async (req, res) => {
  o = await pool.query("SELECT status, date FROM enrollments WHERE UserId = ? ORDER BY date DESC", [req.user.UserId]);

  if (req.user.GroupId == 2 && (o.length <= 0 || o[0].status == "OFF")) {
    res.render('./student/assitance_student', { layout: 'student' });
  } else {
    res.render('./student/assitance_student', { layout: 'studentenrollment' });
  }

});

router.get('/payment', isLoggedIn, async (req, res) => {
   
  const students = await pool.query('SELECT DISTINCT students.id, users.name, users.lastname, enrollments.date, enrollments.date_quota, students.UserId from students INNER JOIN users on students.UserId = users.id INNER JOIN enrollments ON enrollments.UserId = users.id where enrollments.paymentmodality = "Cuotas" and users.id= ? order by students.id desc', [req.user.UserId]);
   res.render('./student/payment', { layout: 'studentenrollment', students});
});

router.get('/account', isLoggedIn, async (req, res) => {

  const students = await pool.query('select * from students INNER JOIN tutors on students.id = tutors.id where UserId = ?', [req.user.UserId]);
  o = await pool.query("SELECT status, date FROM enrollments WHERE UserId = ? ORDER BY date DESC", [req.user.UserId]);

  if (req.user.GroupId == 2 && (o.length <= 0 || o[0].status == "OFF")) {
    res.render('./student/account', { layout: 'student', students: students[0] });
  } else {
    res.render('./student/account', { layout: 'studentenrollment', students: students[0] });
  }

});

router.post('/account', isLoggedIn, async (req, res) => {

  const { name, lastname, email, username } = req.body;
  // const {name, lastname, address, phone, age} = req.body;
  const newUser = {
    name,
    lastname,
    email,
    username
  };
  var address = req.param("address");
  pool.query("Update users set ? where id = ? ", [newUser, req.user.UserId]);
  pool.query("Update students set address = ? where UserId = ? ", [address, req.user.UserId]);
  res.redirect('/profile');
});

router.post('/account/pass', isLoggedIn, async (req, res) => {

  const pass = req.param("newpass");
  const enpass = await helpers.encryptPassword(pass);
  await pool.query("Update users set password = ? where id = ? ", [enpass, req.user.UserId]);
  res.redirect('/profile');
});
router.get('/account/changepassword', isLoggedIn, async (req, res) => {
  o = await pool.query("SELECT status, date FROM enrollments WHERE UserId = ? ORDER BY date DESC", [req.user.UserId]);

  if (req.user.GroupId == 2 && (o.length <= 0 || o[0].status == "OFF")) {
    res.render('./student/changepassword', { layout: 'student' });
  } else {
    res.render('./student/changepassword', { layout: 'studentenrollment' });
  }

});

router.get('/checkout', isLoggedIn, async (req, res) => {
  const monto = await pool.query("SELECT ammount from static_data");
  res.render('./student/checkout', { layout: 'student', monto: monto[0] });
});


router.post('/checkout/payment.json', isLoggedIn, (req, res) => {
  monto = req.param("amount");
  quota = req.param("quota");
  modality = "Contado";
  monto = Math.round(monto / 3.32) + 1;
  if (quota == 2) {
    modality = "Cuotas";
    monto = Math.round(350 / 3.32) + 1;
  };
  paypal.configure({
    'mode': 'sandbox',
    'client_id': 'ATxvAcwV4uajm7zwGq3k_SsjAEKmjCXuNaDQHXt8wGp-v_pU1aypq7HRl_ou2Xj6jjk1jRpMl0RsXRoE',
    'client_secret': 'EEaUiolCwboE8P2YkkuYnGpiZCQn-pk4k8_ZQgrQCMS_fGf-zfPbgOTKsOCxh1987khmEt6D7Yfcpnvr'

  });
  var create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      
      "return_url": "https://latino-app.herokuapp.com/profile/checkout/success",
      "cancel_url": "https://latino-app.herokuapp.com/profile/checkout/cancel"
      // "return_url": "http://localhost:4000/profile/checkout/success",
      // "cancel_url": "http://localhost:4000/profile/checkout/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "item",
          "sku": "item",
          "price": monto,
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": monto
      },
      "description": "This is the payment description."
    }]
  };

  paypal.payment.create(create_payment_json, async function (error, payment) {
    if (error) {
      throw error;
    } else {
      const newOrder = {
        UserId: req.user.UserId,
        date: datenow,
        paypalcode: payment.id
      }
      o = await pool.query("INSERT INTO purchaseorders set ?", [newOrder]);
      idorder = o.insertId;

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
variable = 0;
router.post('/checkout/sedesuccess.json', isLoggedIn, async (req, res) => {
  
   const newOrder = {
      UserId: req.user.UserId,
      date: datenow,
      paypalcode: "sede",
      code: code,
    }
    order = await pool.query("INSERT INTO purchaseorders set ?", [newOrder]);
    var code = "LATINO-000" +  order.insertId;
    variable = order.insertId;
    await pool.query("UPDATE purchaseorders set code = ? where id = ?", [code, order.insertId]);

    res.json({
      object: {
        url: "http://localhost:4000/profile/checkout/sedesuccess"
      },
      status: true,

    });
  
});

router.get('/checkout/sedesuccess', isLoggedIn, async (req, res) => {
  const order = await pool.query('select * from purchaseorders where id = ? ', [variable]);
  console.log(order);
  res.render('./student/sedepayment', { layout: 'studentenrollment', order: order[0] });
});

router.get('/checkout/success', isLoggedIn, async (req, res) => {

  const token = req.query["paymentId"];
  const order = await pool.query('select * from purchaseorders where paypalcode = ? ', [token]);
  var code = "LATINO-000" + order[0].id;
  await pool.query('update purchaseorders set code = ? where paypalcode = ? ', [code, token]);

  const enrollment = {
    paymentmodality: modality,
    date: datenow,
    price: monto * 3.32,
    nquota: quota,
    rate: 0.1,
    total: monto * 3.32,
    status: "ON",
    UserId: req.user.UserId

  };

  e = await pool.query('INSERT INTO enrollments set ?', [enrollment]);
  var iden = e.insertId;
  if(quota == 2){
        try {
          await pool.query("update enrollments set date_quota = date_add(?, interval 30 day) where id = ?", [datenow, iden]);
        } catch (error) {
          console.log("error");
        }
      }
  //update enrollments set date_quota = date_add('2019-02-21 12:42:05', interval 30 day) where id = 6
  const detailsorden = {
    concept: "Matricula",
    price: monto * 3.32,
    PurchaseOrderId: idorder,
    EnrollmentId: iden

  };
  await pool.query('insert into purchaseorderdetails set ?', [detailsorden]);


  var rand = Math.floor((Math.random() * 100) + 54);
  var host = 'local'//req.get('host');
  var link = "http://" + host + "/verify?id=" + rand;
 

  var client = new postmark.ServerClient("df3d08b3-48ef-4010-9227-016bf1ac1858");

  client.sendEmail({
    "From": '"CONFIMACION DE PAGO ACADEMIA LATINO" <i1610110@continental.edu.pe>',
    "To": "i1610110@continental.edu.pe",
    "Subject": "Test",
    "HtmlBody": mailHTML(req.user.name, 'matricularte con nosotros', datenow, code, 'Fecha de transaccion', monto, monto, monto, 'http://localhost:4000/contact')	 // html body
  });

  res.render('./student/successorder', { layout: 'studentenrollment', order: order[0] });




});

router.get('/checkout/cancel', isLoggedIn, async (req, res) => {
  const token = req.query["token"];
  console.log(token);
  const order = await pool.query('select * from purchaseorders where paypalcode = ? ', [token]);
  // res.render('./student/cancelorder', {layout: 'other', students: order[0]});
  console.log(order);
  res.render('./student/cancelorder', { layout: 'student', order: order[0] });
});


function mailHTML(_name, _reason, _date, _description, _invoice, _amount, _subamount, _total, _url) {
  var _html_ = '<html><head>\
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\
    <title>Please pay total_Value due by due_date_Value</title>\
    <style type="text/css" rel="stylesheet" media="all">@media only screen and (max-width: 600px) {.email-body_inner,.email-footer{width:100% !important;}}@media only screen and (max-width: 500px) {.button{width:100% !important;}}</style>\
  </head>\
  <body style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; height: 100%; margin: 0; line-height: 1.4; background-color: #F2F4F6; color: #74787E; -webkit-text-size-adjust: none; width: 100% !important;">\
    <span class="preheader" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; display: none !important;">This is an invoice for your purchase on purchase_date_Value. Please submit payment by due_date_Value</span>\
    <table class="email-wrapper" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #F2F4F6;" width="100%" cellpadding="0" cellspacing="0">\
      <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
        <td style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;" align="center">\
          <table class="email-content" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;" width="100%" cellpadding="0" cellspacing="0">\
            <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
              <td class="email-masthead" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 25px 0; text-align: center;">\
                <a class="email-masthead_name" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; color: #BBBFC3; font-size: 16px; font-weight: bold; text-decoration: none; text-shadow: 0 1px 0 white;" href="http://localhost:4000.com">\
        ACADEMIA LATINO PRE POLICIAL\
      </a>\
              </td>\
            </tr>\
            <tr>\
              <td class="email-body" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; width: 100%; margin: 0; padding: 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0; border-top: 1px solid #EDEFF2; border-bottom: 1px solid #EDEFF2; background-color: #FFF;" width="100%" cellpadding="0" cellspacing="0">\
                <table class="email-body_inner" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; background-color: #FFF;" align="center" width="570" cellpadding="0" cellspacing="0">\
                  <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
                    <td class="content-cell" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 35px;">\
                      <h1 style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; margin-top: 0; color: #2F3133; font-size: 19px; font-weight: bold; text-align: left;">Hola ' + _name + ',</h1>\
                      <p style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 16px;">Gracias por ' + _reason + '.</p>\
                      <table class="attribute-list" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;" width="100%" cellpadding="0" cellspacing="0">\
                        <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
                          <td class="attribute-list-container" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;">\
                            <table style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;" width="100%" cellpadding="0" cellspacing="0">\
                              <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
                                <td class="attribute-list-item" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;"><strong style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;">Monto:</strong> ' + '$' + _amount + '</td>\
                              </tr>\
                            </tbody></table>\
                          </td>\
                        </tr>\
                      </tbody></table>\
                      <table class="purchase" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 35px 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;" width="100%" cellpadding="0" cellspacing="0">\
                        <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
                          <td style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;">\
                            <h3 style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; margin-top: 0; color: #2F3133; font-size: 14px; font-weight: bold; text-align: left;">' + _invoice + '</h3></td>\
                          <td style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;">\
                            <h3 class="align-right" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; margin-top: 0; color: #2F3133; font-size: 14px; font-weight: bold; text-align: right;">' + _date + '</h3></td>\
                        </tr>\
                        <tr>\
                          <td style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;" colspan="2">\
                            <table class="purchase_content" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; width: 100%; margin: 0; padding: 25px 0 0 0; -premailer-width: 100%; -premailer-cellpadding: 0; -premailer-cellspacing: 0;" width="100%" cellpadding="0" cellspacing="0">\
                              <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
                                <th class="purchase_heading" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; padding-bottom: 8px; border-bottom: 1px solid #EDEFF2;">\
                                  <p style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #9BA2AB; font-size: 12px; margin: 0;">Descripcion</p>\
                                </th>\
                                <th class="purchase_heading" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; padding-bottom: 8px; border-bottom: 1px solid #EDEFF2;">\
                                  <p class="align-right" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin-top: 0; color: #9BA2AB; font-size: 12px; margin: 0;">Amount</p>\
                                </th>\
                              </tr>\
                              <tr>\
                                <td class="purchase_item" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 10px 0; color: #74787E; font-size: 15px; line-height: 18px;" width="80%">' + _description + '</td>\
                                <td class="align-right" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; text-align: right;" width="20%">' + _subamount + '</td>\
                              </tr>\
                              <tr>\
                                <td class="purchase_footer" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding-top: 15px; border-top: 1px solid #EDEFF2;" width="80%" valign="middle">\
                                  <p class="purchase_total purchase_total--label" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin-top: 0; color: #2F3133; font-size: 16px; margin: 0; font-weight: bold; padding: 0 15px 0 0;">Total</p>\
                                </td>\
                                <td class="purchase_footer" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding-top: 15px; border-top: 1px solid #EDEFF2;" width="20%" valign="middle">\
                                  <p class="purchase_total" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: right; margin-top: 0; color: #2F3133; font-size: 16px; margin: 0; font-weight: bold;">' + '$' + _total + '</p>\
                                </td>\
                              </tr>\
                            </tbody></table>\
                          </td>\
                        </tr>\
                      </tbody></table>\
                      <p style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 16px;">Si desea mas informacion acerca de este comprobante no dude en contactarnos a:<a style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; color: #3869D4;" href="' + _url + '">Soporte</a></p>\
                      <p style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: left; margin-top: 0; color: #74787E; font-size: 16px;">Gracias,\
                        <br>Colegio Latino</p>\
                    </td>\
                  </tr>\
                </tbody></table>\
              </td>\
            </tr>\
            <tr>\
              <td style="font-family: Arial, \'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word;">\
                <table class="email-footer" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; width: 570px; margin: 0 auto; padding: 0; -premailer-width: 570px; -premailer-cellpadding: 0; -premailer-cellspacing: 0; text-align: center;" align="center" width="570" cellpadding="0" cellspacing="0">\
                  <tbody style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box;"><tr>\
                    <td class="content-cell" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; word-break: break-word; padding: 35px;" align="center">\
                      <p class="sub align-center" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: center; margin-top: 0; color: #AEAEAE; font-size: 12px;">© 2019 product_name_Value. All rights reserved.</p>\
                      <p class="sub align-center" style="font-family: Arial,\'Helvetica Neue\',Helvetica,sans-serif; box-sizing: border-box; line-height: 1.5em; text-align: center; margin-top: 0; color: #AEAEAE; font-size: 12px;">\
                        company_name_Value\
                        <br>company_addres_Value\
                      </p>\
                    </td>\
                  </tr>\
                </tbody></table>\
              </td>\
            </tr>\
          </tbody></table>\
        </td>\
      </tr>\
    </tbody></table>\
  </body></html>';
  return _html_;
}
module.exports = router;