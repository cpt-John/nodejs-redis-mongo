const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongodb = require("mongodb");
dotenv.config();

const port = process.env.PORT || 3000;

console.log(port);
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log("app listing in port " + port);
});

//mongodb
const dbName = "LB";
const collName = "users";
//mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false
// const uri = `mongodb+srv://${process.env.D_EMAIL}:${process.env.D_PASSWORD}@cluster0-lyx1k.mongodb.net/CRM?retryWrites=true&w=majority`;
const uri = `mongodb://localhost:27017/?readPreference=primary&ssl=false`;
const mongoClient = mongodb.MongoClient;

let appName = "app2";

app.get("/", async (req, res) => {
  const client = await mongoClient
    .connect(uri, {
      useUnifiedTopology: true,
    })
    .catch((err) => {
      res.status(500).json({ message: "filed to connect db" });
    });
  if (!client) {
    return;
  }
  const collection = client.db(dbName).collection(collName);
  let result;
  try {
    result = await collection
      .find({}, { projection: { _id: 0 }, limit: 10, sort: { score: -1 } })
      .toArray();
    res.status(200).json({ result, appName });
  } catch (err) {
    res.status(500).json({ message: "filed to retreive" });
  } finally {
    client.close();
  }
});

app.put("/updateUser", async (req, res) => {
  if (!req.body["new_score"] || !req.body["user_name"]) {
    res.status(400).json({ message: "bad request" });
    return;
  }
  const client = await mongoClient
    .connect(uri, {
      useUnifiedTopology: true,
    })
    .catch((err) => {
      res.status(500).json({ message: "filed to connect db" });
    });
  if (!client) {
    return;
  }
  const collection = client.db(dbName).collection(collName);
  let result;
  try {
    result = await collection.updateOne(
      { user_name: req.body["user_name"] },
      { $set: { score: req.body["new_score"] } },
      { upsert: true }
    );
    res.status(200).json({ message: "updated", appName });
  } catch (err) {
    res.status(500).json({ message: "filed to update" });
  } finally {
    client.close();
  }
});
