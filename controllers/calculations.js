const nodemailer = require("nodemailer");
require("dotenv").config();
const Collection = require("../models/collection");

async function send(req, res, next) {
  const { user } = req.user;
  const { _id } = req.body;

  const model = await Collection.findById(_id);

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
    let letterHtml = "";

    if (model.group === "bed") {
      letterHtml =
        `
        <h3>Добрый день</h3>
        <p>${user.name} просит просчитать стоимость изделия.</p>
        <img
            src='https://lh3.googleusercontent.com/d/${calc.image}=w800?authuser=0'
            alt={imageId}
        />
        <p>Общий габарит: ${calc.width} x ${calc.depth}. В ткани "${calc.fabricName}" (${calc.fabricDealer})</p>
        <p>Спальное место: ${req.body.mattressWidth} x ${req.body.mattressDepth}</p>
        ${req.body.standardProportions !== "true"
            ? `<p>Высота изголовья: ${req.body.headHeight}</p>
           <p>Толщина изголовья: ${req.body.headDepth}см</p>
           <p>Высота царги: ${req.body.tsargHeight}</p>
           <p>Толщина царги: ${req.body.tsargWidth}см</p>
          ` : '<p>Стандартные пропорции</p>'}
        ${model.costCalc.drawstrings ?
          `<p>${req.body.drawstrings}</p>
          ` : ''}
        <p>Комментарий: ${calc.comment === "" ? "-" : calc.comment}</p>
        `;
    } else {
      letterHtml =
        `<h3>Добрый день</h3>
        <p>${user.name} просит просчитать стоимость изделия.</p>
        <img
            src='https://lh3.googleusercontent.com/d/${calc.image}=w800?authuser=0'
            alt={imageId}
        />
        <p>Общий габарит: ${calc.width} x ${calc.depth}. В ткани "${calc.fabricName}" (${calc.fabricDealer})</p>
          ${model.costCalc.corner &&
          `<p>Угол ${req.body.angleDirection}</p>`}
          ${model.costCalc.drawstrings &&
            `<p>${req.body.drawstrings}</p>
            `}
          <p>Комментарий: ${calc.comment === "" ? "-" : calc.comment}</p>
          `;
    }

    const addresses = "misazh.ua@gmail.com";

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
