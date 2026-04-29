import cors from "cors";

import type { Request, Response } from "express";
import express from "express";
import { Pool } from "pg";
import { City, CityBody } from "./types/city";

require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = [
  "CITY_API_DB_URL",
  "CITY_API_DB_USER",
  "CITY_API_DB_PWD",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const ADDR = process.env.CITY_API_ADDR || "127.0.0.1";
const PORT = parseInt(process.env.CITY_API_PORT || "2022", 10);

export const pool = new Pool({
  host: process.env.CITY_API_DB_URL,
  port: parseInt(process.env.CITY_API_DB_PORT || "5432", 10),
  user: process.env.CITY_API_DB_USER,
  password: process.env.CITY_API_DB_PWD,
  database: process.env.CITY_API_DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const app = express();

app.use(
  cors({
    origin: `http://${ADDR}:${PORT}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());

/**
 * GET /_health — returns 204 No Content
 */
app.get("/_health", (_req: Request, res: Response) => {
  res.status(204).send();
});

/**
 * GET /cities — returns 200 with the list of cities
 */
app.get("/cities", async (_req: Request, res: Response) => {
  const result = await pool.query<City>("SELECT * FROM city");
  res.status(200).json(result.rows);
});

/**
 * POST /city — creates a city, returns 201 with the created row
 */
app.post("/city", async (req: Request, res: Response) => {
  const { department_code, insee_code, zip_code, name, lat, lon } =
    req.body as CityBody;

  if (!department_code || !name || lat === undefined || lon === undefined) {
    res.status(400).json({
      error: "Missing required fields: department_code, name, lat, lon",
    });
    return;
  }

  const result = await pool.query<CityBody>(
    `INSERT INTO city (department_code, insee_code, zip_code, name, lat, lon)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [department_code, insee_code ?? null, zip_code ?? null, name, lat, lon],
  );

  res.status(201).json(result.rows[0]);
});

if (require.main === module) {
  pool.query("SELECT NOW()", (err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
      process.exit(1);
    }
    console.log("Database connected very successfully");
  });

  const server = app.listen(PORT, ADDR, () => {
    console.log(`Backend listening on http://${ADDR}:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      pool.end(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    shutdown();
  });
}
