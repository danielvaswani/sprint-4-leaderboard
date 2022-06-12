// Loads the configuration from config.env to process.env

require("dotenv/config");

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
// get MongoDB driver connection

const PORT = 5001;
const app = express();

const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;

const connectionString = process.env.ATLAS_URI;
const COLLECTION_NAME = "records";

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();

app.use(bodyParser.json());

async function getLeaderboard() {
  await client.connect();
  return await client
    .db("leaderboard")
    .collection(COLLECTION_NAME)
    .find()
    .toArray();
}

async function addRecord(body) {
  await client.connect();
  return await client
    .db("leaderboard")
    .collection(COLLECTION_NAME)
    .insertOne(body);
}

async function deleteRecordById(id) {
  await client.connect();
  return await client
    .db("leaderboard")
    .collection(COLLECTION_NAME)
    .deleteOne({ _id: ObjectID(id) });
}

async function updateRecordById(id, body) {
  await client.connect();
  return await client
    .db("leaderboard")
    .collection(COLLECTION_NAME)
    .updateOne({ _id: ObjectID(id) }, body);
}

app.get("/api/leaderboard/", async (req, res) => {
  console.log(
    await getLeaderboard()
      .then((data) => res.send(data))
      .catch((error) => res.json(error))
    // .finally(client.close())
  );
});

app.post("/api/leaderboard/record", async (req, res) => {
  await addRecord(req.body)
    .then((response) => res.send(response))
    .catch((error) => res.sendStatus(403));
  // .finally(client.close());
});

app.delete("/api/leaderboard/record/:id", async (req, res) => {
  await deleteRecordById(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404));
  // .finally(client.close());
});

app.put("/api/leaderboard/record/:id", async (req, res) => {
  await updateRecordById(req.params.id, req.body)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404));
  // .finally(client.close());
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;
