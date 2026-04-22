import request from "supertest";

import { app } from "../backend/src/main";

describe("GET /_health", () => {
  it("should return 204 No Content", async () => {
    const res = await request(app).get("/_health");

    expect(res.status).toBe(204);
  });
});
