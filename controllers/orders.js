const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const Order = require("../models/order");
const User = require("../models/user");
const updateSheets = require("../helpers/updateSheets");
const { google } = require("googleapis");
const sendMail = require("../helpers/sendMail");
const pleaseExplainMail = require("../helpers/pleaseExplainMail");
const htmlToPdf = require("html-pdf-node");

function dateToString(date) {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const dateString = `${d.getDate().toString().padStart(2, "0")}.${month
    .toString()
    .padStart(2, "0")}.${d.getFullYear()}`;
  return dateString;
}

async function generatePdf(name, number, dateOfOrder, innerPrice) {
  const date = new Date();
  try {
    const options = {
      format: "A4",
      path: `tmp/ПЕЧАТЬ расх-${number}-${name}.pdf`,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    const file = {
      content: `<div style="padding: 20px">
      <div style="display: flex;">
        <div style="width: 100px">
          <p>Постачальник</p>
        </div>
        <div style="margin-left: 20px">
          <p>ТОВ "Місаж Компані"</br>
          ЄДРПОУ 38212854, тел. 0994144793</br>
          Р/р UA963003460000026004020722201 в АТ АЛЬФА-БАНК</br>
          ІПН 382128526529, номер свідоцтва 200044753</br>
          Адреса м.Київ, вул.Братиславська 52</br></p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="width: 100px">
          <p>Одержувач</p>
        </div>
        <div style="margin-left: 20px">
          <p>тел.</p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="width: 100px">
          <p>Платник</p>
        </div>
        <div style="margin-left: 20px">
          <p>той самий</p>
        </div>
      </div>
      <div style="display: flex;">
        <div style="width: 100px">
          <p>Замовлення</p> 
        </div>
        <div style="margin-left: 20px">
          <p>№ ${number} від ${dateOfOrder}</p>
        </div>
      </div>
      <div>
        <div>
          <p>Умова продажу:</p>
        </div>
      </div>
      <h2 style="text-align: center;">Видаткова накладна № ${number}</br>від ${
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      }.${
        date.getMonth() < 10
          ? "0" + Number(date.getMonth() + 1)
          : Number(date.getMonth() + 1)
      }.${date.getFullYear()} р.</h2>
      <table style="border-collapse:collapse; margin: 5px;" cellspacing="0">
        <tr style="height:12pt">
        <td style="width:26pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
        <p class="s2" style="padding-left: 7pt;text-indent: 0pt;line-height: 11pt;text-align: left;">№</p>
        </td><td style="width:219pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
        <p class="s2" style="text-indent: 0pt;line-height: 11pt;text-align: center;">Товар</p>
        </td><td style="width:23pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
        <p class="s2" style="text-indent: 0pt;line-height: 11pt;text-align: center;">Од.</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
        <p class="s2" style="padding-left: 16pt;text-indent: 0pt;line-height: 11pt;text-align: left;">Кількість</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
        <p class="s2" style="padding-left: 6pt;text-indent: 0pt;line-height: 11pt;text-align: left;">Ціна без ПДВ</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" bgcolor="#BFBFBF">
        <p class="s2" style="padding-right: 3pt;text-indent: 0pt;line-height: 11pt;text-align: right;">Сума без ПДВ</p>
        </td></tr><tr style="height:12pt"><td style="width:26pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s3" style="padding-right: 1pt;text-indent: 0pt;text-align: right;">1</p>
        </td><td style="width:219pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="padding-left: 2pt;text-indent: 0pt;line-height: 10pt;text-align: left;">${name}</p>
        </td><td style="width:23pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="text-indent: 0pt;line-height: 10pt;text-align: center;">шт</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="padding-left: 50pt;text-indent: 0pt;line-height: 10pt;text-align: left;">1,000</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="padding-left: 39pt;text-indent: 0pt;line-height: 10pt;text-align: left;">${innerPrice}</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="padding-right: 1pt;text-indent: 0pt;line-height: 10pt;text-align: right;">${innerPrice}</p>
        </td></tr><tr style="height:12pt"><td style="width:26pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s3" style="padding-right: 1pt;text-indent: 0pt;text-align: right;">2</p>
        </td><td style="width:219pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent: 0pt;text-align: left;"><br/></p>
        </td><td style="width:23pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="text-indent: 0pt;line-height: 11pt;text-align: center;">шт</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p style="text-indent: 0pt;text-align: left;"><br/></p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p style="text-indent: 0pt;text-align: left;"><br/></p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="padding-right: 1pt;text-indent: 0pt;line-height: 11pt;text-align: right;">0,00</p>
        </td></tr><tr style="height:14pt"><td style="width:424pt;border-top-style:solid;border-top-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="5"><p class="s5" style="padding-right: 4pt;text-indent: 0pt;line-height: 12pt;text-align: right;">Разом без ПДВ:</p>
        </td><td style="width:78pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt">
        <p class="s5" style="padding-right: 1pt;text-indent: 0pt;line-height: 12pt;text-align: right;">${innerPrice}</p>
        </td></tr>
      </table>
      <p style="padding-left: 34pt;">Місце складання:</p>
      <div style="display: flex;">
          <div>
              <p style="padding-left: 34pt;">Від постачальника*_________________</p>
              <p style="margin-left: 150px">директор Хамучинський М.Я.</p>
          </div>
          <div style="margin-left: 100px">
            <p>Отримав(ла)_________________</p>
            <p style="margin-left: 130px;">за дов. № від . .</p>
          </div>
      </div>
      <p class="s9" style="padding-top: 5pt;padding-left: 34pt;text-indent: 0pt;text-align: left;">* Відповідальний за здійснення господарської операції і правильність її оформлення</p>
    </div>
    `,
    };
    await htmlToPdf.generatePdf(file, options);
  } catch (error) {
    console.log(error);
  }
}

async function getOrdersFromSheets(client, spreadsheetId, range, organization) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const orders = [];

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found.");
      return orders;
    }

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      if (
        !row[0] ||
        row[0] === "" ||
        !row[1] ||
        row[1] === "" ||
        !row[11] ||
        !row[15]
      ) {
        const criticalRows = [row[0], row[1], row[11], row[15]];
        const fieldNames = [
          "Группа товару",
          "Розмір",
          "Дата замовлення",
          "Планова дата готовності",
        ];
        const errors = [];
        criticalRows.forEach((el, index) => {
          if (!el || el === "") {
            errors.push(fieldNames[index]);
          }
        });
        let owner = await User.find({ name: `${row[9]}` }).exec();
        if (!owner || owner === undefined || owner.length < 1) {
          owner = [{ email: "dyomin.andrew1@gmail.com" }];
        }

        await pleaseExplainMail(owner[0].email, errors, row[9], organization);
        continue;
      }

      const date = new Date();
      const dateOfOrderString = row[11];
      const deadlineString = row[15];
      const dateOfOrderParts = dateOfOrderString.split(".");
      const deadlineParts =
        !row[15] || row[15] === ""
          ? [
              `${date.getDate()}`,
              `${date.getMonth() + 1}`,
              `${date.getFullYear}`,
            ]
          : deadlineString.split(".");
      const dateOfOrderObject = new Date(
        `${dateOfOrderParts[2]}-${dateOfOrderParts[1]}-${dateOfOrderParts[0]}`
      );
      const deadlineObject = new Date(
        `${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`
      );
      const imagesArray = !row[18] || row[18] === "" ? [] : row[18].split(",");

      const order = {
        group: row[0],
        size: row[1],
        name: row[2],
        fabric: row[3],
        description: row[4],
        base: row[5],
        deliveryDate: row[6],
        innerPrice: row[7],
        number: row[8],
        dealer: row[9],
        deadline: row[10],
        dateOfOrder: dateOfOrderObject.toISOString(),
        adress: row[12],
        additional: row[13],
        rest: row[14],
        plannedDeadline: deadlineObject.toISOString(),
        orderStatus: row[16] || "",
        _id: row[17],
        images: imagesArray,
        fabricStatus: row[19] || "",
        coverStatus: row[20] || "",
        frameStatus: row[21] || "",
      };

      if (!row[17] || row[17] === "") {
        const id = `${organization}.${uuidv4()}`;
        const sheetName = range.slice(0, range.indexOf("!"));
        const updateRange = `${sheetName}!R${index + 2}`;
        await updateSheets(sheets, spreadsheetId, updateRange, [id]);
        order._id = id;
      }

      orders.push(order);
    }

    return orders;
  } catch (err) {
    console.log(err);
  }
}

async function getAllOrders(req, res, next) {
  const { access } = req.user.user;
  const client = req.sheets.client;
  const allOrdersArray = [];

  if (access.demo) {
    const spreadsheetId = process.env.DEMO_SHEET_LINK;
    const range = "Лист1!A2:V";
    const organization = "demo";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  if (access.misazh) {
    const spreadsheetId = process.env.MISAZH_SHEET_LINK;
    const range = "Лист1!A2:V";
    const organization = "misazh";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  if (access.mebTown) {
    const spreadsheetId = process.env.MEBTOWN_SHEET_LINK;
    const range = "Лист1!A2:V";
    const organization = "mebtown";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  if (access.homeIs) {
    const spreadsheetId = process.env.HOMEIS_SHEET_LINK;
    const range = "Лист1!A2:V";
    const organization = "homeis";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  if (access.other) {
    const spreadsheetId = process.env.OTHER_SHEET_LINK;
    const range = "Лист1!A2:V";
    const organization = "yura";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  if (access.sweetHome) {
    const spreadsheetId = process.env.SWEET_HOME_SHEET_LINK;
    const range = "Лист1!A2:V";
    const organization = "sweethome";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  if (access.millini) {
    const spreadsheetId = process.env.MILLINI_SHEET_LINK;
    const range = "замовлення !A2:V";
    const organization = "millini";
    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    if (orders && orders.length !== 0) {
      allOrdersArray.push(...orders);
    }
  }

  try {
    if (!allOrdersArray.length) {
      res.status(200).send({ message: "Orders not found" });
    }

    allOrdersArray.sort((a, b) => {
      if (a.plannedDeadline > b.plannedDeadline) {
        return 1;
      }
      if (a.plannedDeadline < b.plannedDeadline) {
        return -1;
      }
      return 0;
    });

    res.status(200).json({ allOrdersArray });
  } catch (err) {
    console.log(err);
  }
}

async function addOrder(req, res, next) {
  const user = req.user.user;
  const today = new Date();
  const month = today.getMonth() + 1;
  const plannedDate = new Date();
  plannedDate.setDate(plannedDate.getDate() + Number(req.body.deadline));
  const plannedMonth = plannedDate.getMonth() + 1;
  const client = req.sheets.client;
  const sheets = google.sheets({ version: "v4", auth: client });

  let spreadsheetId = "";
  let range = "Лист1!A2:V";
  const order = req.body;
  order.dealer = user.name;
  order.dateOfOrder = today;
  order.plannedDeadline = `${plannedDate.getDate()}.${plannedMonth
    .toString()
    .padStart(2, "0")}.${plannedDate.getFullYear()}`;

  if (user.organization === "misazh") {
    spreadsheetId = process.env.MISAZH_SHEET_LINK;
  } else if (user.organization === "sweethome") {
    spreadsheetId = process.env.SWEET_HOME_SHEET_LINK;
  } else if (user.organization === "Yura") {
    spreadsheetId = process.env.OTHER_SHEET_LINK;
  } else if (user.organization === "homeIs") {
    spreadsheetId = process.env.HOMEIS_SHEET_LINK;
  } else if (user.organization === "mebTown") {
    spreadsheetId = process.env.MEBTOWN_SHEET_LINK;
  } else if (user.organization === "demo") {
    spreadsheetId = process.env.DEMO_SHEET_LINK;
  } else if (user.organization === "millini") {
    spreadsheetId = process.env.MILLINI_SHEET_LINK;
    range = "замовлення !A2:V";
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            `${order.group}`,
            `${order.size}`,
            `${order.name}`,
            `${order.fabric}`,
            `${order.description}`,
            ``,
            ``,
            ``,
            `${order.number}`,
            `${order.dealer}`,
            `${order.deadline}`,
            `${today.getDate()}.${month
              .toString()
              .padStart(2, "0")}.${today.getFullYear()}`,
            `${order.adress}`,
            ``,
            `${order.rest}`,
            `${order.plannedDeadline}`,
            ``,
            ``,
            `${order.images}`,
            ``,
            ``,
            ``,
          ],
        ],
      },
    });

    res.status(200).json({ message: "Order created" });
  } catch (err) {
    console.log(err);
  }
}

async function updateOrder(req, res, next) {
  try {
    const client = req.sheets.client;
    const sheets = google.sheets({ version: "v4", auth: client });
    const {
      group,
      size,
      name,
      fabric,
      description,
      base,
      deliveryDate,
      innerPrice,
      number,
      dealer,
      deadline,
      dateOfOrder,
      adress,
      additional,
      rest,
      plannedDeadline,
      orderStatus,
      _id,
      fabricStatus,
      coverStatus,
      frameStatus,
      images,
    } = req.body;
    const organization = _id.slice(0, _id.indexOf("."));
    let spreadsheetId = "";
    let row = "";
    let range = "";

    if (organization === "misazh") {
      spreadsheetId = process.env.MISAZH_SHEET_LINK;
      range = "Лист1!A2:V";
    } else if (organization === "mebtown") {
      spreadsheetId = process.env.MEBTOWN_SHEET_LINK;
      range = "Лист1!A2:V";
    } else if (organization === "homeis") {
      spreadsheetId = process.env.HOMEIS_SHEET_LINK;
      range = "Лист1!A2:V";
    } else if (organization === "yura") {
      spreadsheetId = process.env.OTHER_SHEET_LINK;
      range = "Лист1!A2:V";
    } else if (organization === "sweethome") {
      spreadsheetId = process.env.SWEET_HOME_SHEET_LINK;
      range = "Лист1!A2:V";
    } else if (organization === "millini") {
      spreadsheetId = process.env.MILLINI_SHEET_LINK;
      range = "замовлення !A2:V";
    }

    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );

    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      if (order._id === _id) {
        row = `${range.slice(0, range.indexOf("!"))}!A${index + 2}:V`;
        if (order.orderStatus !== "TRUE" && orderStatus === "TRUE") {
          let owner = await User.find({ name: `${dealer}` }).exec();
          if (!owner || owner === undefined || owner.length < 1) {
            owner = [{ email: "dyomin.andrew1@gmail.com" }];
          }
          const letterTitle = `Ваше замовлення №${number} готове`;
          let letterHtml = '';
          if (!innerPrice || innerPrice === "") {
            letterHtml = `
            <h1>${number}</h1>
            <h3>${group} ${name}</h3>
            <p>Ваше замовлення готове, але я не можу знайти вхідну ціну.</p>
            `;
          } else {
            letterHtml = `
            <h1>${number}</h1>
            <h3>${group} ${name}</h3>
            <p>ткань: ${fabric}</p>
            <p>опис: ${description}</p>
            <p>дата замовлення: ${dateOfOrder}</p>
            <p>адреса доставки: ${adress}</p>
            <p>залишок: ${rest}</p>
            <p>дозавантаження: ${additional}</p>
            <b>планова дата: ${plannedDeadline}</b>
            `;
          }

          await generatePdf(name, number, dateOfOrder, innerPrice);

          await sendMail(owner[0].email, letterTitle, letterHtml, number, name);
        }
      }
    }

    const values = [
      group,
      size,
      name,
      fabric,
      description,
      base,
      deliveryDate,
      innerPrice,
      number,
      dealer,
      deadline,
      dateOfOrder,
      adress,
      additional,
      rest,
      plannedDeadline,
      orderStatus,
      _id,
      images.join(","),
      fabricStatus,
      coverStatus,
      frameStatus,
    ];

    await updateSheets(sheets, spreadsheetId, row, values);

    const date = new Date();
    const dateOfOrderParts = dateOfOrder.split(".");
    const deadlineParts =
      !plannedDeadline || plannedDeadline === ""
        ? [`${date.getDate()}`, `${date.getMonth()}`, `${date.getFullYear}`]
        : plannedDeadline.split(".");
    const dateOfOrderObject = new Date(
      `${dateOfOrderParts[2]}-${dateOfOrderParts[1]}-${dateOfOrderParts[0]}`
    );
    const deadlineObject = new Date(
      `${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`
    );
    const imagesArray = !images ? [] : images;

    const newOrder = {
      group,
      size,
      name,
      fabric,
      description,
      base,
      deliveryDate,
      innerPrice,
      number,
      dealer,
      deadline,
      dateOfOrder: dateOfOrderObject.toISOString(),
      adress,
      additional,
      rest,
      plannedDeadline: deadlineObject.toISOString(),
      orderStatus,
      _id,
      images: imagesArray,
      fabricStatus,
      coverStatus,
      frameStatus,
    };

    res.status(200).send(newOrder);
  } catch (error) {
    next(error);
  }
}

async function archiveOrder(req, res, next) {
  try {
    const client = req.sheets.client;
    const sheets = google.sheets({ version: "v4", auth: client });
    const _id = req.body._id;
    const organization = _id.slice(0, _id.indexOf("."));

    const spreadsheetLinks = {
      misazh: process.env.MISAZH_SHEET_LINK,
      mebtown: process.env.MEBTOWN_SHEET_LINK,
      homeis: process.env.HOMEIS_SHEET_LINK,
      yura: process.env.OTHER_SHEET_LINK,
      sweethome: process.env.SWEET_HOME_SHEET_LINK,
      millini: process.env.MILLINI_SHEET_LINK,
    };

    const spreadsheetId = spreadsheetLinks[organization];
    const range =
      organization === "millini" ? "замовлення !A2:V" : "Лист1!A2:V";

    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetId = metadata.data.sheets[0].properties.sheetId;

    const orders = await getOrdersFromSheets(
      client,
      spreadsheetId,
      range,
      organization
    );
    let targetOrder = null;
    let targetRow = null;

    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      if (order._id === _id) {
        targetOrder = order;
        targetRow = `${range.slice(0, range.indexOf("!"))}!A${index + 2}:V`;
        break;
      }
    }

    if (!targetOrder) {
      res.status(404).send("Order not found");
      return;
    }

    const appendRange = `готово!A2:B`;

    const values = [
      targetOrder.group,
      targetOrder.size,
      targetOrder.name,
      targetOrder.fabric,
      targetOrder.description,
      targetOrder.base,
      targetOrder.deliveryDate,
      targetOrder.innerPrice,
      targetOrder.number,
      targetOrder.dealer,
      targetOrder.deadline,
      dateToString(targetOrder.dateOfOrder),
      targetOrder.adress,
      targetOrder.additional,
      targetOrder.rest,
      dateToString(targetOrder.plannedDeadline),
      targetOrder.orderStatus,
      targetOrder._id,
      targetOrder.images.length > 0 ? JSON.stringify(targetOrder.images) : "",
      targetOrder.fabricStatus,
      targetOrder.coverStatus,
      targetOrder.frameStatus,
    ];

    const sanitizedValues = values.map((value) =>
      value !== undefined && value !== null ? value.toString().trim() : ""
    );

    const appendRequest = {
      spreadsheetId,
      range: appendRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [sanitizedValues],
      },
    };

    const archiveResponse = await sheets.spreadsheets.values.append(
      appendRequest
    );

    if (archiveResponse.status === 200) {
      const deleteRequest = {
        spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: "ROWS",
                  startIndex: parseInt(targetRow.split("A")[1], 10) - 1,
                  endIndex: parseInt(targetRow.split("A")[1], 10),
                },
              },
            },
          ],
        },
      };
      await sheets.spreadsheets.batchUpdate(deleteRequest);
      res.status(200).send("Order archived successfully");
    } else {
      console.error("Failed to archive order:", archiveResponse.status);
      res.status(500).send("Failed to archive order");
    }
  } catch (error) {
    console.error("Error archiving order:", error);
    next(error);
  }
}

async function deleteOrder(req, res, next) {
  const { id } = req.body;
  try {
    await Order.findByIdAndDelete(id);

    res.status(200).json({ message: "Order was deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOrders,
  addOrder,
  updateOrder,
  archiveOrder,
  deleteOrder,
};
