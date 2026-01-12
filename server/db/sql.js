import {Pool} from 'pg';
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

dotenv.config();

const pool = new Pool({connectionString: process.env.DATABASE_URL});
export const db = drizzle(pool, {schema});

export const testDbConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("🟢 PostgreSQL connected:", result.rows[0]);
  } catch (err) {
    console.error("🔴 PostgreSQL connection failed:", err.message);
    process.exit(1); // Stop server if DB is essential
  }
};