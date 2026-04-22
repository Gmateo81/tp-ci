import { Pool } from "pg";

require("dotenv").config();

export const testPool = new Pool({
  host: process.env.CITY_API_DB_URL,
  port: parseInt(process.env.CITY_API_DB_PORT ?? "5432", 10),
  user: process.env.CITY_API_DB_USER,
  password: process.env.CITY_API_DB_PWD,
  database: process.env.CITY_API_DB_NAME,
});

// Vider la table avant chaque test pour garantir l'isolation entre les cas.
beforeEach(async () => {
  await testPool.query("TRUNCATE TABLE city RESTART IDENTITY CASCADE");
});

// Fermer la connexion à la fin de la suite de tests.
afterAll(async () => {
  await testPool.end();
});
