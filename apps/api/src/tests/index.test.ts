import request from "supertest";
import { app, initializeApp } from "./index";

// Test the test datasource
describe("POST /users", () => {
  it("should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ email: "Test", hash: "User", salt: '30' });
    expect(response.status).toBe(201);
    expect(response.text).toContain("User created with id:");
  });
});

describe("GET /users", () => {
  it("should retrieve all users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
