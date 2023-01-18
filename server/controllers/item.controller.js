const itemRepo = require("../models/item.model");
const sheets = require("../sheets_api/index");
const firstAPI = require("../store_apis/first");
const secondAPI = require("../store_apis/second");

async function getItems(req, res) {
  const items = await noteRepo.getItems();

  res.json({
    items,
  });
}

async function getItemsFuzzy(req, res) {
  const searchPhrase = req.query["search"];
  const itemsCached = await itemRepo.getItemsFuzzy(searchPhrase);
  itemsCached.forEach((item) => delete item.id);

  if (itemsCached.length != 0) {
    res.json({
      items: itemsCached,
    });
    return;
  }
  let items = await firstAPI.getItems(req.query.search);
  itemRepo.createItems(items);
  if (items.length == 0) {
    items = await secondAPI.getItems(req.query.search);
    itemRepo.createItems(items);
  }
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
