require("dotenv").config();

const { MongoClient } = require("mongodb");
const setupDb = require("./database");
const createApp = require("./app");

const PORT = process.env.PORT || 4001;
const mongo = new MongoClient(process.env.MONGO_ATLAS_CONNECTION_STRING);

const asyncMain = async () => {
    await mongo.connect();
    console.log("Connected successfully to mongo");

    const database = setupDb(mongo.db("gigapp"));
    const app = createApp({ database });

    app.listen(PORT, () => {
        console.log(`Listening on: ${PORT}`);
    });
};

asyncMain().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
