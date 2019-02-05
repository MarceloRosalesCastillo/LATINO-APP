"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.webfaction.com",
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'latino_mailbox_host56725a', // generated ethereal user
      pass: 'host56725@mail@latino1' // generated ethereal password
    }
  });


  let mailOptions = {
    from: '"Fred Foo 👻" <rrojasen@continental.edu.pe>', // sender address
    to: "i1028417@continental.edu.pe", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };


  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  
}

main().catch(console.error);