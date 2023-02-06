const axios = require("axios");
const { parse } = require("node-html-parser");

async function getItems(searchPhrase) {
  const items = await search(searchPhrase);
  return items;
}

async function getItem({ EAN, artNumber }) {
  const searchPhrase = EAN ? EAN : artNumber;
  for (let time = 50; time < 2000; time += 50) {
    const items = await search(searchPhrase);
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
      .get(process.env.THIRDAPI + phrase)
      .then(async (resp) => {
        let items = parseProductListHTML(resp.data);
        await Promise.all(
          items.map(async (item) => {
            await axios
              .get(item.link)
              .then(async (resp) => {
                item.EAN = await getProductEANFromHTML(resp.data);
                delete item.link;
              })
              .catch((err) => {
                console.log(err);
                // reject(err);
              });
          })
        );

        resolve(items);
      })
      .catch((err) => {
        console.log(err);
        // reject(err);
      });
  });
}

async function getProductEANFromHTML(html) {
  return parse(html).querySelector(
    "#product_addtocart_form > div.product-shop > div.product-info > div:nth-child(4) > div.col-xs-8"
  ).innerText;
}

function parseProductListHTML(html) {
  let items = [];
  let productList = parse(html)
    .querySelector("#products-list")
    .childNodes.filter((node) => node.nodeType === 1);

  productList.forEach((product) => {
    let item = {};
    const productInfo = product.childNodes[5];
    item.name = productInfo.childNodes[1].innerText.trim();
    item.link = productInfo.childNodes[1].childNodes[0].attributes.href;
    item.artNumber = productInfo.childNodes[3].innerText.match(
      "Art.code: (.*)\\nOEM"
    )[1];
    item.store = process.env.THIRDNAME;
    items.push(item);
  });
  return items;
}

module.exports = {
  getItems,
  getItem,
};
