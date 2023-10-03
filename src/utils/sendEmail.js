const nodemailer = require("nodemailer");

const sendEmail = async (email, otp, name) => {
  var Transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  var MailOption = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject: "hopprz registration email",
    text: `Welcome to hopprz ${name}! and your otp is=${otp}`,
  };

  Transporter.sendMail(MailOption, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email has been send", info.response);
    }
  });
};
module.exports = sendEmail;
// const nodemailer = require("nodemailer");

// const sendEmail = async (email, otp, name) => {
//   // console.log(email, otp, name)
//   var Transporter = nodemailer.createTransport({
//     service: process.env.SMPT_SERVICE,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });
//   var MailOption = {
//     from: process.env.SMPT_MAIL,
//     to: "tinaaaa@yopmaill.com",
//     subject: "Udemy  registration email",
//     text: `Welcome to udemy ${name}! and your otp is=${otp}`,
//   };
//   console.log(MailOption);

//   Transporter.sendMail(MailOption, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
// // console.log(info);
//       console.log("email has been send", info.response);
    
//     }
//   });
// };
// module.exports = sendEmail;