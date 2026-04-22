import request from "supertest";

import { app } from "../backend/src/main";
import { testPool } from "./setup";

describe("POST /city — insertion", () => {
  it("should return 201 and persist the city in the database", async () => {
    const payload = {
      department_code: "75",
      insee_code: "75056",
      zip_code: "75001",
      name: "Paris",
      lat: 48.8566,
      lon: 2.3522,
    };

    const res = await request(app).post("/city").send(payload);

    // Vérifie la réponse HTTP
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body.id).toBeDefined();

    // Vérifie la persistance réelle en base de données
    const { rows } = await testPool.query(
      "SELECT * FROM city WHERE name = $1",
      ["Paris"],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].department_code).toBe("75");
  });

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/city").send({ name: "Paris" });

    expect(res.status).toBe(400);
  });
});
