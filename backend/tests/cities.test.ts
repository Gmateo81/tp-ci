import request from "supertest";

import { app } from "../src/main";
import { testPool } from "./setup";

describe("GET /cities — liste des villes", () => {
  it("should return 200 with an empty array when no cities exist", async () => {
    const res = await request(app).get("/cities");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 with all cities", async () => {
    await testPool.query(
      `INSERT INTO city (department_code, insee_code, zip_code, name, lat, lon)
       VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12)`,
      [
        "75",
        "75056",
        "75001",
        "Paris",
        48.8566,
        2.3522,
        "69",
        "69123",
        "69001",
        "Lyon",
        45.764,
        4.8357,
      ],
    );

    const res = await request(app).get("/cities");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ name: "Paris", department_code: "75" });
    expect(res.body[1]).toMatchObject({ name: "Lyon", department_code: "69" });
  });
});
