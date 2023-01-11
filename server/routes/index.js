const itemController = require("../controllers/item.controller");

const routes = (app) => {
  app.get("/list", itemController.getItems);
  app.get("/search", async (req, res) => {
    console.log(req.query["search"]);
    if (!req.query.search) {
      res.send("No search query");
      return;
    }
    await itemController.getItemsFuzzy(req, res);
    //let result = await search(req.query.search);
    //res.send(res);
  });

  function search(phrase) {
    return new Promise((resolve, reject) => {
      console.log(
        request(process.env.FIRSTAPI + phrase, (err, res, body) => {
          if (err) {
            console.log("Error sending message: ", err);
            reject(err);
          } else if (body.error) {
            console.log("Error: ", body.error);
            reject(new Error(body.error));
          }
          resolve(body);
        })
      );
    });
  }
};

module.exports = routes;
