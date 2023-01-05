require("dotenv").config();
const request = require("request");
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/search", async (req, res) => {
  if (!req.query.search) res.send("No search query");
  let result = await search(req.query.search);
  res.send(result);
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
