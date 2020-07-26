const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const port = process.env.PORT || 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log("app listing in port " + port);
});

let lb = 1;

app.get("/", (req, res) => {
  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  let reqstr = fullUrl.replace("3000", lb == 1 ? "3001" : "3002");
  lb = lb == 1 ? 2 : 1;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", reqstr);
  xhr.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status) {
      let result = await JSON.parse(xhr.responseText);
      res.status(200).json(result);
    }
  };
  xhr.send();
});

app.put("/updateUser", (req, res) => {
  let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  let reqstr = fullUrl.replace("3000", lb == 1 ? "3001" : "3002");
  lb = lb == 1 ? 2 : 1;
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", reqstr);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status) {
      let result = await JSON.parse(xhr.responseText);
      if (this.status == 200) updateRedis(fullUrl);
      res.status(this.status).json(result);
    }
  };
  xhr.send(JSON.stringify(req.body));
});

app.get("*", (req, res) => {
  res.status(400).json({ message: "page doest exist" });
});
app.put("*", (req, res) => {
  res.status(400).json({ message: "page doest exist" });
});

function updateRedis(url) {
  url = url.replace("3000", "3001");
  url = url.replace("updateUser", "updateRedis");
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status) {
      let result = await JSON.parse(xhr.responseText);
      console.log(result);
    }
  };
  xhr.send();
}
