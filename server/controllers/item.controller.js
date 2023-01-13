const axios = require("axios");
const { parse } = require("node-html-parser");
const itemRepo = require("../models/item.model");

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
  const body = await search(req.query.search);
  const items = parseFirstAPI(body);
  res.json({ items });
  // setTimeout(async () => {
  //   const searchPhrase = req.query["search"];
  //   const items = await itemRepo.getItemsFuzzy(searchPhrase);

  //   res.json({
  //     items,
  //   });
  // }, 5000);
}
function parseFirstAPI(html) {
  let items = [];
  const productList = parse(html)
    .getElementsByTagName("div")
    .filter((HTMLElement) => HTMLElement.classList.contains("productlist"));

  productList.forEach((product) => {
    let item = {};
    product.childNodes.forEach((HTMLElement) => {
      const classList = HTMLElement.classList;
      if (classList.contains("productlistdesc"))
        item.name = HTMLElement.firstChild.innerHTML;
      else if (classList.contains("productlistartnr"))
        item.artNumber = HTMLElement.firstChild.innerHTML;
      else if (classList.contains("productlistean"))
        item.EAN = HTMLElement.innerHTML;
    });
    item.store = process.env.FIRSTNAME;
    items.push(item);
  });
  return items;
}

function search(phrase) {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.FIRSTAPI + phrase)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

module.exports = {
  getItems,
  getItemsFuzzy,
};
