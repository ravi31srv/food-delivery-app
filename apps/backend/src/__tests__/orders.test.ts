// src/__tests__/orders.test.ts
import request from "supertest";
import {app} from "../app.js";

const validOrderPayload = {
  customerName: "Ravi",
  customerAddress: "Ahmedabad",
  customerPhone: "9999999999",
  items: [
    {
      itemId: "6a2091c06dc8e69778226805", // use a real seeded ID
      quantity: 6,
    },
  ],
};

describe("POST /orders", () => {
  it("should place an order and return 200/201", async () => {
    const res = await request(app)
      .post("/orders")
      .send(validOrderPayload)
      .set("Content-Type", "application/json");

console.log("STATUS:", res.status);
  console.log("BODY:", JSON.stringify(res.body, null, 2));

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("message", "Place order service");
    expect(res.body).toHaveProperty("data");
  });

  it("should return correct order structure", async () => {
    const res = await request(app)
      .post("/orders")
      .send(validOrderPayload)
      .set("Content-Type", "application/json");

    const { data } = res.body;
    expect(data).toHaveProperty("_id");
    expect(data).toHaveProperty("status", "Order Received");
    expect(data).toHaveProperty("totalAmount");
    expect(data).toHaveProperty("items");
    expect(Array.isArray(data.items)).toBe(true);
  });

  it("should compute totalAmount correctly", async () => {
    const res = await request(app)
      .post("/orders")
      .send(validOrderPayload)
      .set("Content-Type", "application/json");

    const { data } = res.body;
    const item = data.items[0];
    const expectedTotal = item.unitPrice * item.quantity;
    expect(data.totalAmount).toBe(expectedTotal);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ customerName: "Ravi" }) // missing items, phone, address
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
  });
});