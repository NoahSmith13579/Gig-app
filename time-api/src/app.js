const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const asyncHandler = require("express-async-handler");
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");

const hasRequestBody = (body) =>
    typeof body === "string"
        ? body.length > 0
        : body !== null &&
          typeof body === "object" &&
          Object.keys(body).length > 0;

const createApp = ({
    database,
    oauthClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID),
    secretKey = process.env.SECRET_KEY,
}) => {
    const app = express();

    app.use(morgan("dev"));
    app.use(cors({ origin: "*" }));
    app.use(bodyParser.text({ type: "*/*" }));

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.get(
        "/api/projects",
        asyncHandler(async (req, res) => {
            const projects = await database.getProjects();

            res.send({
                content: [...projects],
                success: true,
            });
        })
    );

    app.post(
        "/api/projects",
        asyncHandler(async (req, res) => {
            if (!hasRequestBody(req.body)) {
                res.status(400).send("No request body");
                return;
            }

            const payload = JSON.parse(req.body);
            payload.id = uuidv4();

            await database.createProject(payload);

            res.send({
                success: true,
                content: payload,
            });
        })
    );

    app.get(
        "/api/projects/:projectId",
        asyncHandler(async (req, res) => {
            const project = await database.getProject(req.params.projectId);

            if (!project) {
                res.status(404).end();
                return;
            }

            res.send({
                success: true,
                content: { ...project },
            });
        })
    );

    app.put(
        "/api/projects/:projectId",
        asyncHandler(async (req, res) => {
            if (!hasRequestBody(req.body)) {
                res.status(400).send("No request body");
                return;
            }

            const project = await database.getProject(req.params.projectId);

            if (!project) {
                res.status(404).end();
                return;
            }

            const payload = JSON.parse(req.body);
            delete payload._id;
            await database.updateProject(payload);

            res.send({ success: true, content: { ...payload } });
        })
    );

    app.delete(
        "/api/projects/:projectId",
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
        "/api/auth/google",
        asyncHandler(async (req, res) => {
            if (!hasRequestBody(req.body)) {
                res.status(400).send("No request body");
                return;
            }

            const token = JSON.parse(req.body);
            const { sub, email } = await oauthClient.getTokenInfo(token);
            const newToken = jwt.sign(
                { sub, name: email.split("@")[0], email },
                secretKey,
                { algorithm: "HS256", expiresIn: "30m" }
            );

            res.send({ success: true, content: newToken });
        })
    );

    app.post(
        "/api/auth/renew",
        asyncHandler((req, res) => {
            const authorization = req.headers["authorization"];
            if (!authorization) {
                res.status(401).end();
                return;
            }

            const parts = authorization.split(" ");
            if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
                res.status(400).end();
                return;
            }

            let decoded;
            try {
                decoded = jwt.verify(parts[1], secretKey, {
                    algorithms: ["HS256"],
                });
            } catch (err) {
                res.status(400).end();
                return;
            }

            delete decoded.exp;
            const newToken = jwt.sign(decoded, secretKey, {
                algorithm: "HS256",
                expiresIn: "30m",
            });
            res.send({ content: newToken, success: true });
        })
    );

    app.use((err, req, res, next) => {
        console.error(err.stack);
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).send({
            message: "An internal server error occured.",
            success: false,
            content: null,
        });
    });

    return app;
};

module.exports = createApp;
