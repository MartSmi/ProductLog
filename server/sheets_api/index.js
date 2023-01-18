require("dotenv").config();
const { google } = require("googleapis");
const spreadsheetId = process.env.SPREADSHEET_ID;

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "server/sheets_api/keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  return { googleSheetsInstance, auth };
}
async function overwriteSheet(items, sheetName) {
  const { googleSheetsInstance, auth } = await authenticate();
  const values = itemsToValues(items);

  await googleSheetsInstance.spreadsheets.values.clear({
    auth,
    spreadsheetId,
    range: sheetName + "!A2:D",
  });

  await googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: sheetName + "!A2:B",
    valueInputOption: "RAW",
    resource: {
      values,
    },
  });
}

async function appendSheet(items) {
  const { googleSheetsInstance, auth } = await authenticate();

  const values = itemsToValues(items);
  await googleSheetsInstance.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "RAW",
    resource: {
      values,
    },
  });
}

async function getAllSheetsItems(stores) {
  const { googleSheetsInstance, auth } = await authenticate();
  let items = [];
  for (const store of stores) {
    const values = (
      await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range: store + "!A:D", //sheet name and range of cells
      })
    ).data.values;
    values.shift();
    items.push.apply(items, cellRangeToItemObjects(values, store));
  }
  return items;
}

function cellRangeToItemObjects(cells, store) {
  let items = [];
  cells.forEach((row) => {
    //TODO: now only supports missing EAN, add support for missing artNumber
    items.push({
      name: row[0],
      artNumber: row[1],
      EAN: row[2],
      quantity: parseInt(row[3]),
      store,
    });
  });
  return items;
}

function itemsToValues(items) {
  return items.map((item) => [
    item.name,
    item.artNumber,
    item.EAN,
    item.quantity,
  ]);
}

module.exports = {
  overwriteSheet,
  appendSheet,
  getAllSheetsItems,
};
