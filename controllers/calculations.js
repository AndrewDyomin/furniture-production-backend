const nodemailer = require("nodemailer");
require("dotenv").config();

async function send(req, res, next) {
  const { user } = req.user;

  try {
    const calc = {
      width: req.body.width,
      depth: req.body.depth,
      name: req.body.name,
      comment: req.body.comment,
      image: req.body.images[0],
      fabricDealer: req.body.fabricDealer,
      fabricName: req.body.fabricName,
    };

    const letterTitle = `Просчёт ${calc.name}`;
    const letterHtml = `
            <h3>Добрый день</h3>
            <p>${user.name} просит просчитать стоимость изделия.</p>
            <img
                src='https://lh3.googleusercontent.com/d/${calc.image}=w800?authuser=0'
                alt={imageId}
            />
            <p>Общий габарит: ${calc.width} x ${calc.depth}. В ткани ${calc.fabricName} (${calc.fabricDealer})</p>
            <p>Комментарий: ${calc.comment}</p>
            <p></p>
            `;

    const addresses = "dyomin.andrew1@gmail.com";

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
    };

    transporter
      .sendMail(emailOptions)
      .then(() => {
        console.log(`Letter to ${addresses} sended`);
      })
      .catch((err) => console.log(err));

    res.status(200).json({ message: "Calculation sended" });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { send };
