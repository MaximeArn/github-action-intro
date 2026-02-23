const app = require("./server");
const request = require("supertest");
const { pool } = require("../db/db");

describe("server endpoints", () => {
  // GET /object
  describe("get object", () => {
    test("status code 200", async () => {
      const response = await request(app).get("/api/object");
      expect(response.status).toBe(200);
    });

    test("returns json", async () => {
      const { headers } = await request(app).get("/api/object");

      expect(headers["content-type"]).toBe("application/json; charset=utf-8");
    });

    test("body is valid", async () => {
      const response = await request(app).get("/api/object");
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Hello, World!");
      expect(typeof response.body.timestamp).toBe("string");
    });
  });

  // POST /register
  describe("create user", () => {
    beforeEach(async () => {
      await pool.query("DELETE FROM users");
      testUser = {
        firstname: "John",
        lastname: "Doe",
        email: "johnDoe@gmail.com",
      };
    });

    afterAll(async () => {
      await pool.end();
    });

    test("create user with valid data", async () => {
      const { status, body } = await request(app)
        .post("/api/users")
        .send(testUser);
      expect(status).toBe(201);
      expect(body.data.firstname).toBe(testUser.firstname);
      expect(body.data.lastname).toBe(testUser.lastname);
      expect(body.data.email).toBe(testUser.email);
    });

    test("create user that already exists", async () => {
      const { status, body } = await request(app)
        .post("/api/users")
        .send(testUser);
      const response = await request(app).post("/api/users").send(testUser);
      expect(response.status).toBe(500);
    });
  });
});
