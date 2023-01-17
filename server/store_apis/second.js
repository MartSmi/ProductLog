const axios = require("axios");
const { parse } = require("node-html-parser");

async function getItems(searchPhrase) {
  const items = await search(searchPhrase);
  return items;
}

async function getItem({ EAN, artNumber }) {
  const searchPhrase = EAN ? EAN : artNumber;
  for (let time = 50; time < 2000; time += 50) {
    const body = await search(searchPhrase);
    const items = parseProductListHTML(body);
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
      .get(process.env.SECONDAPI + phrase)
      .then(async (resp) => {
        let items = parseProductListHTML(resp.data);
        await Promise.all(
          items.map(async (item) => {
            await axios.get(item.link).then(async (resp) => {
              item.EAN = await getProductEANFromHTML(resp.data);
              delete item.link;
            });
          })
        );

        resolve(items);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

async function getProductEANFromHTML(html) {
  let productMetaData = parse(html).querySelectorAll(".product-meta")[0];
  return productMetaData.childNodes[5].childNodes[3].childNodes[1].innerText.trim();
}

function parseProductListHTML(html) {
  let items = [];
  let productList = parse(html).querySelectorAll(".caption");

  productList.forEach((product) => {
    let item = {};
    const nameAndLinkElement =
      product.childNodes[1].childNodes[1].childNodes[0];
    const artNumberElement = product.childNodes[3].childNodes[1].childNodes[1];
    item.name = nameAndLinkElement.innerText;
    item.link = nameAndLinkElement.attributes.href;
    item.artNumber = artNumberElement.innerText.trim();
    item.store = process.env.SECONDNAME;
    items.push(item);
  });
  return items;
}

module.exports = {
  getItems,
  getItem,
};
