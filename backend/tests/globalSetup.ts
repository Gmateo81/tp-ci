import { Pool } from "pg";

// globalSetup runs once before all test suites, in a separate process.
export default async function globalSetup() {
  require("dotenv").config();

  const pool = new Pool({
    host: process.env.CITY_API_DB_URL,
    port: parseInt(process.env.CITY_API_DB_PORT ?? "5432", 10),
    user: process.env.CITY_API_DB_USER,
    password: process.env.CITY_API_DB_PWD,
    database: process.env.CITY_API_DB_NAME,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS city (
      id              SERIAL PRIMARY KEY,
      department_code VARCHAR(10)  NOT NULL,
      insee_code      VARCHAR(10),
      zip_code        VARCHAR(10),
      name            VARCHAR(255) NOT NULL,
      lat             FLOAT        NOT NULL,
      lon             FLOAT        NOT NULL
    )
  `);

  await pool.end();
}
