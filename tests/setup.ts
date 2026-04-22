import { Pool } from "pg";

require("dotenv").config();

export const testPool = new Pool({
  host: process.env.CITY_API_DB_URL,
  port: parseInt(process.env.CITY_API_DB_PORT ?? "5433", 10),
  user: process.env.CITY_API_DB_USER,
  password: process.env.CITY_API_DB_PWD,
  database: process.env.CITY_API_DB_NAME,
});

// Créer la table si elle n'existe pas
beforeAll(async () => {
  await testPool.query(`
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
});

// Vider la table avant chaque test pour garantir l'isolation entre les cas.
beforeEach(async () => {
  await testPool.query("TRUNCATE TABLE city RESTART IDENTITY CASCADE");
});

// Fermer la connexion à la fin de la suite de tests.
afterAll(async () => {
  await testPool.end();
});
