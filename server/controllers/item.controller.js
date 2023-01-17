const itemRepo = require("../models/item.model");
const sheets = require("../sheets_api/index");
const firstAPI = require("../store_apis/first");
const sheets = require("../sheets_api/index");
const firstAPI = require("../store_apis/first");

async function getItems(req, res) {
  const items = await noteRepo.getItems();

  res.json({
    items,
  });
}

async function getItemsFuzzy(req, res) {
  const searchPhrase = req.query["search"];
  const itemsCached = await itemRepo.getItemsFuzzy(searchPhrase);

  if (itemsCached.length != 0) {
    res.json({
      items: itemsCached,
    });
    return;
  }
  const items = await firstAPI.getItems(req.query.search);
  res.json({ items });
}

async function cacheSheetToDB() {
  const items = await sheets.getAllSheetsItems();
  let newItems = [];

  await Promise.all(
    items.map(async (item) => {
      let newItem;
      if (!item.EAN) {
        newItem = await firstAPI.getItem({ artNumber: item.artNumber });
        newItem.quantity = item.quantity;
        item = newItem;
      }
      newItems.push(item);
    })
  );
  await itemRepo.upsertItems(newItems);
}

async function updateSheetFromDB() {
  const storeName = process.env.FIRSTNAME;
  const items = await itemRepo.getItems();
  await sheets.overwriteSheet(items, storeName); //TODO store names
}

module.exports = {
  getItems,
  getItemsFuzzy,
  cacheSheetToDB,
  updateSheetFromDB,
};
