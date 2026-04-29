import { Pool } from 'pg';
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

dotenv.config();

// 🚨 ADD CONNECTION LIMITS for memory safety
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 30, // 🚨 MAX 10 connections to prevent memory overload
    idleTimeoutMillis: 30000, // Close idle connections after 30s
    connectionTimeoutMillis: 2000, // Fail fast if can't connect
});

// 🚨 ADD CONNECTION MONITORING
pool.on('connect', () => {
    console.log('🟢 New database connection established');
});

pool.on('remove', () => {
    console.log('🔴 Database connection removed');
});

// 🚨 ADD ERROR HANDLING
pool.on('error', (err) => {
    console.error('🔴 Unexpected database error:', err);
});

export const db = drizzle(pool, { schema });

// 🚨 IMPORTANT: Create a safe query helper
export const safeQuery = async (text, params = []) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`📊 Query executed in ${duration}ms: ${text.substring(0, 100)}...`);
        return result;
    } catch (error) {
        console.error('🔴 Query failed:', { text, params, error: error.message });
        throw error;
    }
};

// 🚨 IMPORTANT: Safe connection helper for transactions
export const withConnection = async (callback) => {
    const client = await pool.connect();
    try {
        return await callback(client);
    } finally {
        client.release(); // 🚨 CRITICAL: Always release connection
    }
};

export const testDbConnection = async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("🟢 PostgreSQL connected:", result.rows[0]);

        // 🚨 ADD: Check current connection count
        const connections = await pool.query(
            "SELECT count(*) as connections FROM pg_stat_activity WHERE datname = current_database()"
        );
        console.log(`📊 Active connections: ${connections.rows[0].connections}`);
    } catch (err) {
        console.error("🔴 PostgreSQL connection failed:", err.message);
        process.exit(1);
    }
};