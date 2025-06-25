import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: mysql.Connection | undefined;
  promise: Promise<mysql.Connection> | undefined;
};

const createConnection = async (): Promise<mysql.Connection> => {
  if (globalForDb.conn) {
    return globalForDb.conn;
  }
  
  if (globalForDb.promise) {
    return globalForDb.promise;
  }
  
  globalForDb.promise = mysql.createConnection(env.DATABASE_URL);
  const conn = await globalForDb.promise;
  
  if (env.NODE_ENV !== "production") {
    globalForDb.conn = conn;
  }
  
  globalForDb.promise = undefined;
  return conn;
};

// Create a lazy connection
let dbInstance: ReturnType<typeof drizzle> | undefined;

export const getDb = async () => {
  if (!dbInstance) {
    const conn = await createConnection();
    dbInstance = drizzle(conn, { schema });
  }
  return dbInstance;
};

// For compatibility, export a promise that resolves to the db
export const db = getDb();
