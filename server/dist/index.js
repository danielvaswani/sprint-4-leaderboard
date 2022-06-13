// Loads the configuration from config.env to process.env
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv/config");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
// get MongoDB driver connection
const PORT = process.env.PORT;
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
app.use(cors());
function getLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        return yield client
            .db("leaderboard")
            .collection(COLLECTION_NAME)
            .find()
            .toArray();
    });
}
function addRecord(body) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client
            .db("leaderboard")
            .collection(COLLECTION_NAME)
            .insertOne(body);
    });
}
function deleteRecordById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client
            .db("leaderboard")
            .collection(COLLECTION_NAME)
            .deleteOne({ _id: ObjectID(id.toString()) });
    });
}
function updateRecordById(id, body) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client
            .db("leaderboard")
            .collection(COLLECTION_NAME)
            .updateOne({ _id: ObjectID(id.toString()) }, { $set: { name: body.name, points: body.points } });
    });
}
app.get("/api/leaderboard/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(yield getLeaderboard()
        .then((data) => res.send(data))
        .catch((error) => res.json(error))
    // .finally(client.close())
    );
}));
app.post("/api/leaderboard/record", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield addRecord(req.body)
        .then((response) => res.send(response))
        .catch((error) => res.sendStatus(403));
    // .finally(client.close());
}));
app.delete("/api/leaderboard/record/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.params.id);
    yield deleteRecordById(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(404));
    // .finally(client.close());
}));
app.put("/api/leaderboard/record/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    yield updateRecordById(req.params.id, req.body)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(404));
    // .finally(client.close());
}));
// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
module.exports = app;
//# sourceMappingURL=index.js.map