const itemController = require("../controllers/item.controller");

const routes = (app) => {
  app.get("/list", itemController.getItems);
  app.put("/update", itemController.updateItem);
  app.put("/import", itemController.cacheSheetToDB);
  app.put("/export", itemController.updateSheetFromDB);
  app.get("/search", async (req, res) => {
    console.log(req.query["search"]);
    if (!req.query["search"]) {
      res.send("No search query");
      return;
    }
    await itemController.getItemsFuzzy(req, res);

    //res.send(res);
  });
  // app.get("/cache", itemController.cacheSheetToDB);
};

module.exports = routes;
