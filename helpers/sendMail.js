const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendMail(recipient, letterTitle, letterHtml) {
  try {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: "misazh.bot@meta.ua",
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
      from: "misazh.bot@meta.ua",
      to: `${recipient}`,
      subject: `${letterTitle}`,
      html: `${letterHtml}`,
    };

    transporter
      .sendMail(emailOptions)
      .then((info) => console.log(info))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendMail;
