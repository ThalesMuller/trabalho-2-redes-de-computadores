module.exports = {
  sendEmail: (subject, corpoMsg) => {

    var nodemailer  = require('nodemailer');

    var email       = "rededecomputadoresprojeto@gmail.com";

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: 'brunnoehtop'
      }
    });
    
    var mailOptions = {
      from: email,
      to: email,
      subject: subject,
      text: corpoMsg
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}