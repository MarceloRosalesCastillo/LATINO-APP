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

  var rand=Math.floor((Math.random() * 100) + 54);
  var host='local'//req.get('host');
  var link="http://"+host+"/verify?id="+rand;
  let mailOptions = {
    from: '"Fred Foo 👻" <rrojasen@continental.edu.pe>', // sender address
    to: "i1610110@continental.edu.pe", // list of receivers
    subject: "Please confirm your Email account", // Subject line
    text: "Hello world?", // plain text body
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	 // html body
  };


  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  
}

main().catch(console.error);