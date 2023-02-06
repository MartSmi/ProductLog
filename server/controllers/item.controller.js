const itemRepo = require("../models/item.model");
const sheets = require("../sheets_api/index");
const firstAPI = require("../store_apis/first");
const secondAPI = require("../store_apis/second");
const thirdAPI = require("../store_apis/third");

const storeNames = [
  process.env.FIRSTNAME,
  process.env.SECONDNAME,
  process.env.THIRDNAME,
];

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
  if (items.length == 0) {
    items = await thirdAPI.getItems(req.query.search);
    itemRepo.createItems(items);
  }
  res.json({ items });
}

async function cacheSheetToDB() {
  const items = await sheets.getAllSheetsItems(storeNames);
  let newItems = [];

  await Promise.all(
    items.map(async (item) => {
      let newItem;
      if (!item.EAN) {
        if (item.store == storeNames[0])
          newItem = await firstAPI.getItem({ artNumber: item.artNumber });
        else if (item.store == storeNames[1])
          newItem = await secondAPI.getItem({ artNumber: item.artNumber });
        //TODO
        newItem.quantity = item.quantity;
        item = newItem;
      }
      newItems.push(item);
    })
  );
  await itemRepo.upsertItems(newItems);
}

async function updateItem(req, res) {
  const item = req.body.item;
  await itemRepo.upsertItem(item);

  res.send();
}

async function updateSheetFromDB(req, res) {
  const items = (await itemRepo.getItems()).filter(
    (item) => item.quantity != 0
  );
  storeNames.forEach(async (storeName) => {
    const storeItems = items.filter((item) => item.store === storeName);
    await sheets.overwriteSheet(storeItems, storeName);
  });
  res.send();
}

module.exports = {
  getItems,
  getItemsFuzzy,
  cacheSheetToDB,
  updateItem,
  updateSheetFromDB,
};
