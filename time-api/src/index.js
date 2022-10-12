require("dotenv").config();

const jwt = require("jsonwebtoken");
const fs = require("fs");
const { OAuth2Client } = require("google-auth-library");

const privateKey = fs.readFileSync("./keys/priv.key").toString();
const publicKey = fs.readFileSync("./keys/pub.pem").toString();

const oauthClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

const setupDb = require("./database");

const cors = require("cors");
const http = require("http");
const asyncHandler = require("express-async-handler");
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");

const PORT = process.env.PORT || 4001;

const app = express();

var corsOptions = {
    origin: "*",
};

//Error handler middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.send({
        message: "An internal server error occured.",
        success: false,
        content: null,
    });
    res.end();
});

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.text({ type: "*/*" }));

app.get("/", (req, res) => {
    res.send("Hello World").end();
});

const { MongoClient } = require("mongodb");

const CON_STR = process.env.MONGO_CONNECTION_STRING;

const mongo = new MongoClient(CON_STR);
let database;

//Serves publickey
app.get("/public", (req, res) => {
    let buff = new Buffer(publicKey);
    let base64data = buff.toString("base64");

    res.send({ success: true, content: { public: base64data } }).end();
});

app.get(
    "/projects",
    asyncHandler(async (req, res) => {
        const projects = await database.getProjects();

        res.send({
            content: [...projects],
            success: true,
        }).end();
    })
);

app.post(
    "/projects",
    asyncHandler(async (req, res) => {
        if (!req.body) {
            res.send(400).end();
        }
        const payload = JSON.parse(req.body);

        payload.id = uuidv4();

        database.createProject(payload);

        console.log(`Added project ${payload.id}`);
        res.send({
            success: true,
            content: payload,
        }).end();
    })
);

app.get(
    "/projects/:projectId",
    asyncHandler(async (req, res) => {
        const { projectId } = req.params;

        const project = await database.getProject(projectId);

        if (!project) {
            res.status(404).end();
            return;
        }

        res.send({
            success: true,
            content: {
                ...project,
            },
        }).end();
    })
);

app.put(
    "/projects/:projectId",
    asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        const project = await database.getProject(projectId);
        const payload = JSON.parse(req.body);

        if (!project) {
            res.status(404).end();
            return;
        }

        if (!req.body) {
            res.status(400).send("No request body").end();
            return;
        }

        delete payload._id;
        await database.updateProject(payload);

        res.send({ success: true, content: { ...payload } });
    })
);
app.delete(
    "/projects/:projectId",
    asyncHandler(async (req, res) => {
        const { projectId } = req.params;
        const project = await database.getProject(projectId);

        if (!project) {
            res.status(404).end();
            return;
        }

        await database.deleteProject(projectId);

        res.send({ success: true });
    })
);

app.post(
    "/auth/google",
    asyncHandler(async (req, res) => {
        if (!req.body) {
            res.send(400).end();
        }
        const token = JSON.parse(req.body);

        const tokenInfo = await oauthClient.getTokenInfo(token);
        console.log(tokenInfo);

        const { sub, email } = tokenInfo;

        const name = email.split("@")[0];

        /**
         * Get user's permissions / scopes, etc.
         */

        const newPayload = {
            sub,
            name,
            email,
        };

        /**
         *  Send this  back as a new token
         * */

        const newToken = jwt.sign(newPayload, privateKey, {
            algorithm: "RS256",
            expiresIn: "10m",
        });

        console.log(
            jwt.verify(newToken, publicKey, {
                algorithm: ["RS256"],
            })
        );

        console.log("newtoken", newToken);

        res.send({ success: true, content: newToken }).end();
    })
);

app.post(
    "/auth/renew",
    asyncHandler((req, res) => {
        if (!req.headers["authorization"]) {
            res.status(401).end();
            return;
        }

        let authorization = req.headers["authorization"];
        let parts = authorization.split(" ");
        if (parts[0].toLowerCase() !== "bearer" || parts.length != "2") {
            res.status(400).end();
            return;
        }

        const token = parts[1];

        let decoded;
        try {
            decoded = jwt.verify(token, publicKey, {
                algorithm: "RS256",
            });
        } catch (err) {
            res.status(400).end();
            console.log(token);
            console.log("Error verifying token, " + err);
            return;
        }

        delete decoded.exp;

        const newToken = jwt.sign(decoded, privateKey, {
            algorithm: "RS256",
            expiresIn: "10m",
        });
        return res.send({
            content: newToken,
            success: true,
        });
    })
);

const asyncMain = async () => {
    await mongo.connect();
    console.log("Connected successfully to mongo");

    database = setupDb(mongo.db("gigapp"));

    app.listen(PORT, () => {
        console.log(`Listening on: ${PORT}`);
    });
};

asyncMain().catch(console.error);
