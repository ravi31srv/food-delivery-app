// src/__tests__/menuItems.test.ts
import request from "supertest";
import {app} from "../app.js";

describe("GET /menu-items", () => {
  it("should return 200 with message and data array", async () => {
    const res = await request(app).get("/menu-items");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Get menu items");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return items with required fields", async () => {
    const res = await request(app).get("/menu-items");

    const item = res.body.data[0];
    expect(item).toHaveProperty("_id");
    expect(item).toHaveProperty("name");
    expect(item).toHaveProperty("description");
    expect(item).toHaveProperty("price");
    expect(item).toHaveProperty("isAvailable");
    expect(typeof item.price).toBe("number");
    expect(typeof item.isAvailable).toBe("boolean");
  });

  it("should return at least one menu item", async () => {
    const res = await request(app).get("/menu-items");
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});