const request = require("supertest");
const express = require("express");
const router = require("./routes/router");
const app = express();
app.use(express.json());
app.use(router);

describe("Router", () => {
  it('GET / should return "Hello Asksuite World!"', async () => {
    const response = await request(app).get("/");
    expect(response.text).toBe("Hello Asksuite World!");
    expect(response.statusCode).toBe(200);
  });

  it("POST /search without dates should return 400", async () => {
    const response = await request(app).post("/search").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Check-in and check-out dates are required."
    );
  });
});
