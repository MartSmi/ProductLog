const axios = require("axios");
const { parse } = require("node-html-parser");

async function getItems(searchPhrase) {
  const body = await search(searchPhrase);
  const items = parseAPI(body);
  return items;
}

async function getItem({ EAN, artNumber }) {
  const searchPhrase = EAN ? EAN : artNumber;
  for (let time = 50; time < 2000; time += 50) {
    const body = await search(searchPhrase);
    const items = parseAPI(body);
    for (const item of items) {
      if (item.EAN == "") item.EAN = undefined;
      if (EAN != undefined) if (item.EAN == EAN) return item;
      if (artNumber != undefined) if (item.artNumber == artNumber) return item;
    }
    await new Promise((resolve) => setTimeout(resolve, time));
  }
  return null;
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

function parseAPI(html) {
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

module.exports = {
  getItems,
  getItem,
};
