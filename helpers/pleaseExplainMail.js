const nodemailer = require("nodemailer");
require("dotenv").config();

async function pleaseExplainMail(recipient, errors, dealer, organization) {
  try {
    const errorsList = () => {
        if (errors.length > 1) {
            return (`
                <div>
                    <p>Вот список полей, которые я не смог прочесть:</p>
                    <ul>
                        ${errors.map(err => `
                            <li>
                                <b>${err}</b>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `)
        } else {
            return (`
                <p>Я не смог прочесть поле <b>${errors[0]}</b></p>
            `)
        }
    }
    const letterTitle = `Не могу прочитать новый заказ`;
    const letterHtml = `
            <h3>Добрый день</h3>
            <p>Я вижу что ${dealer} добавил(а) новый заказ, но я не могу прочитать в нем некоторые поля.</p>
            ${errorsList()}
            <p>Источник: ${organization}</p>
            <p>Помогите мне пожалуйста</p>
            `;
    const addresses = recipient === 'dyomin.andrew1@gmail.com' ? `${recipient}` : `${recipient}, dyomin.andrew1@gmail.com`;

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
      .then(() => {console.log(`Letter to ${addresses} sended`)})
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
}

module.exports = pleaseExplainMail;
