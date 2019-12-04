module.exports = {
  sendEmail: (subject, corpoMsg) => {

    let nodemailer = require('nodemailer');

    let email = ""; //Insira o email de serviço
    let pass = ""; //Insira a senha do email de serviço
    let admEmail = ""; //Insira o email do Administrador que ira receber os e-mails de aviso

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: pass
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
