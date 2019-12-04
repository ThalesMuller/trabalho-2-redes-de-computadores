module.exports = {
  sendEmail: (subject, corpoMsg) => {

    let nodemailer = require('nodemailer');

    let email = "rededecomputadoresprojeto@gmail.com";
    let admEmail = 'thales.em@gmail.com';

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: 'brunnoehtop'
      }
    });

    let mailOptions = {
      from: email,
      to: admEmail,
      subject: subject,
      text: corpoMsg
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}