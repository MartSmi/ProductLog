const itemRepo = require("../models/item.model");

async function getItems(req, res) {
  const items = await noteRepo.getItems();

  res.json({
    items,
  });
}

async function getItemsFuzzy(req, res) {
  const searchPhrase = req.query["search"];
  const items = await itemRepo.getItemsFuzzy(searchPhrase);

  res.json({
    items,
  });
  // setTimeout(async () => {
  //   const searchPhrase = req.query["search"];
  //   const items = await itemRepo.getItemsFuzzy(searchPhrase);

  //   res.json({
  //     items,
  //   });
  // }, 5000);
}

module.exports = {
  getItems,
  getItemsFuzzy,
};
