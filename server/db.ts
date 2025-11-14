import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

// Check if DATABASE_URL is properly configured
const isDatabaseConfigured = process.env.DATABASE_URL && 
  !process.env.DATABASE_URL.includes('user:password') &&
  !process.env.DATABASE_URL.includes('ep-example');

if (!isDatabaseConfigured) {
  console.warn("⚠️  DATABASE_URL is not properly configured. Using fallback mode.");
  console.warn("⚠️  To enable database features, configure DATABASE_URL in .env file");
  console.warn("⚠️  Get a free database at: https://neon.tech");
}

// Use a dummy connection string if database is not configured
const connectionString = isDatabaseConfigured 
  ? process.env.DATABASE_URL!
  : "postgresql://dummy:dummy@localhost:5432/dummy";

export const db = drizzle({
  connection: connectionString,
  schema,
  ws: ws,
});

export const isDbConfigured = isDatabaseConfigured;
