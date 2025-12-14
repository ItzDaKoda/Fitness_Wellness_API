const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../database/models/associations");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth", () => {
  test("register + login returns token", async () => {
    const reg = await request(app).post("/auth/register").send({
      name: "Auth User",
      email: "auth@example.com",
      password: "password123",
      role: "user"
    });
    expect(reg.statusCode).toBe(201);

    const login = await request(app).post("/auth/login").send({
      email: "auth@example.com",
      password: "password123"
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});
