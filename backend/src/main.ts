
import cors from "cors";

import type { Request, Response } from 'express';
import express from 'express';
import { Pool } from 'pg';

// Check env variables
const ADDR = process.env.CITY_API_ADDR || '127.0.0.1';
const PORT = parseInt(process.env.CITY_API_PORT || '2022', 10);

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

export const app = express();

app.use(
  cors({
    origin: `http://${ADDR}:${PORT}`,
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
// Configure connexions to database
const pool = new Pool({
  host: process.env.CITY_API_DB_URL,
  port: parseInt(process.env.CITY_API_DB_PORT || '5432', 10),
  user: process.env.CITY_API_DB_USER,
  password: process.env.CITY_API_DB_PWD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup (will fail if DB is not ready)
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("Database connected successfully");
});


// Routes

/**
 * GET /_health
 * Returns a 204 code (No Content)
 */
app.get('/_health', (_req: Request, res: Response) => {
  res.status(204).send(); 
});


const server = app.listen(PORT, ADDR, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Health check: http://${ADDR}:${PORT}/_health`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down gracefully...");

  server.close(() => {
    console.log("HTTP server closed");

    pool.end(() => {
      console.log("Database pool closed");
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  shutdown();
});

