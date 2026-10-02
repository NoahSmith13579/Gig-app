const { beforeEach, describe, it } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const createApp = require("../src/app");

const SECRET = "test-secret-key";

describe("API", () => {
    let app;
    let database;
    let projects;
    let oauthClient;

    beforeEach(() => {
        projects = [
            {
                id: "project-1",
                name: "Garden",
                description: null,
                owner: "Alex",
                profit: { costs: [], revenues: [] },
                daysWorked: [],
            },
        ];
        database = {
            getProjects: async () => projects,
            getProject: async (id) => projects.find((project) => project.id === id),
            createProject: async (project) => projects.push(project),
            updateProject: async (project) => {
                projects = projects.map((existing) =>
                    existing.id === project.id ? project : existing
                );
            },
            deleteProject: async (id) => {
                projects = projects.filter((project) => project.id !== id);
            },
        };
        oauthClient = {
            getTokenInfo: async () => ({
                sub: "google-user-1",
                email: "alex@example.com",
            }),
        };
        app = createApp({ database, oauthClient, secretKey: SECRET });
    });

    it("returns health and project list responses", async () => {
        const health = await request(app).get("/");
        assert.equal(health.status, 200);
        assert.equal(health.text, "Hello World");

        const response = await request(app).get("/api/projects");
        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { content: projects, success: true });
    });

    it("creates projects with a generated ID and returns the stored project", async () => {
        const response = await request(app).post("/api/projects").send({
            name: "Workshop",
            owner: "Alex",
        });

        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.match(response.body.content.id, /^[0-9a-f-]{36}$/i);
        assert.equal(response.body.content.name, "Workshop");
        assert.deepEqual(projects.at(-1), response.body.content);
    });

    it("rejects project creation without a request body", async () => {
        const response = await request(app).post("/api/projects");
        assert.equal(response.status, 400);
        assert.equal(projects.length, 1);
    });

    it("gets a project by ID and returns 404 for unknown IDs", async () => {
        const response = await request(app).get("/api/projects/project-1");
        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { success: true, content: projects[0] });

        const missing = await request(app).get("/api/projects/missing");
        assert.equal(missing.status, 404);
    });

    it("updates a project while excluding MongoDB's internal ID", async () => {
        const update = {
            id: "project-1",
            _id: "mongo-id",
            name: "Garden",
            profit: { costs: [{ amount: 10 }], revenues: [] },
            daysWorked: [],
        };

        const response = await request(app)
            .put("/api/projects/project-1")
            .send(update);

        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.equal("_id" in response.body.content, false);
        assert.equal("_id" in projects[0], false);
        assert.deepEqual(projects[0], response.body.content);
    });

    it("returns 404 for updates to unknown projects and 400 for empty updates", async () => {
        const missing = await request(app).put("/api/projects/missing").send({
            id: "missing",
        });
        assert.equal(missing.status, 404);

        const empty = await request(app).put("/api/projects/project-1");
        assert.equal(empty.status, 400);
    });

    it("deletes existing projects and returns 404 for unknown IDs", async () => {
        const response = await request(app).delete("/api/projects/project-1");
        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { success: true });
        assert.equal(projects.length, 0);

        const missing = await request(app).delete("/api/projects/missing");
        assert.equal(missing.status, 404);
    });

    it("issues a signed application token after validating a Google token", async () => {
        const response = await request(app)
            .post("/api/auth/google")
            .send({ token: "google-credential" });

        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        const payload = jwt.verify(response.body.content, SECRET);
        assert.equal(payload.sub, "google-user-1");
        assert.equal(payload.name, "alex");
        assert.equal(payload.email, "alex@example.com");
        assert.equal(typeof payload.iat, "number");
    });

    it("renews valid bearer tokens and rejects missing or invalid authorization", async () => {
        const token = jwt.sign({ sub: "user-1", email: "user@example.com" }, SECRET);

        const response = await request(app)
            .post("/api/auth/renew")
            .set("Authorization", `Bearer ${token}`);
        assert.equal(response.status, 200);
        const renewedPayload = jwt.verify(response.body.content, SECRET);
        assert.equal(renewedPayload.sub, "user-1");
        assert.equal(renewedPayload.email, "user@example.com");
        assert.ok(renewedPayload.exp > Math.floor(Date.now() / 1000));

        const missing = await request(app).post("/api/auth/renew");
        assert.equal(missing.status, 401);

        const malformed = await request(app)
            .post("/api/auth/renew")
            .set("Authorization", "Token invalid");
        assert.equal(malformed.status, 400);

        const invalid = await request(app)
            .post("/api/auth/renew")
            .set("Authorization", "Bearer invalid");
        assert.equal(invalid.status, 400);
    });
});
