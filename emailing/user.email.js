const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noort.mohamed@gmail.com',
      pass: 'jrdamjhcdphgdfey',
    },
  });

  const info = await transporter.sendMail({
    from: '"noor" <noort.mohamed@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: 'Hello ✔', // Subject line
    html: options.html, // html body
  });

  console.log(info);
};
module.exports = { sendEmail };
