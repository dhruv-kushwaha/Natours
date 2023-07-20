const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '825c14ca89aecc',
      pass: 'a9b9fd7999ae8d',
    },
    // Activate in gmail : "less secure app" option
    // Sendgrid, mailgun  dev : mailtrap
  });
  // 2) Define the email options
  // console.log({ transporter });
  const emailOptions = {
    from: 'Dhruv Kushwaha <admin@dhruv.io>',
    // from: 'dhruvok5@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // console.log({ emailOptions });
  // 3) Actually send the email
  // console.log('Sending Email');
  await transporter.sendMail(emailOptions);
  // console.log('Email Send');
};

module.exports = sendEmail;
