const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("node:fs")

async function sendMail(recipient, letterTitle, letterHtml, number, name) {
  try {
    const addresses = recipient === 'dyomin.andrew1@gmail.com' ? `${recipient}` : `${recipient}, dyomin.andrew1@gmail.com`
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
      to: addresses,
      subject: `${letterTitle}`,
      html: `${letterHtml}`,
      attachments: [
        {
            path: `tmp/ПЕЧАТЬ расх-${number}-${name}.pdf`
        },
      ]
    };

    transporter
      .sendMail(emailOptions)
      .then(() => {fs.unlink(`tmp/ПЕЧАТЬ расх-${number}-${name}.pdf`, (err) => {
        if (err) {
          console.error('Error', err);
      }});})
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendMail;
