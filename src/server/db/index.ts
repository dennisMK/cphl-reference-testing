import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "@/env";
import * as usersSchema from "./schemas/users";
import * as eidSchema from "./schemas/eid";
import * as vlLimsSchema from "./schemas/vl_lims";

/**
 * Cache the database connections in development. This avoids creating new connections on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  usersConn: mysql.Connection | undefined;
  eidConn: mysql.Connection | undefined;
  vlLimsConn: mysql.Connection | undefined;
  promises: {
    users?: Promise<mysql.Connection>;
    eid?: Promise<mysql.Connection>;
    vlLims?: Promise<mysql.Connection>;
  };
};

if (!globalForDb.promises) {
  globalForDb.promises = {};
}

const createConnection = async (database: 'users' | 'eid' | 'vlLims'): Promise<mysql.Connection> => {
  const dbUrl = database === 'users' 
    ? env.DATABASE_URL 
    : database === 'eid' 
    ? env.DATABASE_URL_EID 
    : env.DATABASE_URL_VL_LIMS;
  
  const existingConn = globalForDb[`${database}Conn` as keyof typeof globalForDb] as mysql.Connection;
  if (existingConn) {
    return existingConn;
  }
  
  if (globalForDb.promises[database]) {
    return globalForDb.promises[database]!;
  }
  
  globalForDb.promises[database] = mysql.createConnection(dbUrl);
  const conn = await globalForDb.promises[database]!;
  
  if (env.NODE_ENV !== "production") {
    if (database === 'users') globalForDb.usersConn = conn;
    if (database === 'eid') globalForDb.eidConn = conn;
    if (database === 'vlLims') globalForDb.vlLimsConn = conn;
  }
  
  globalForDb.promises[database] = undefined;
  return conn;
};

// Create database instances
let usersDbInstance: ReturnType<typeof drizzle> | undefined;
let eidDbInstance: ReturnType<typeof drizzle> | undefined;
let vlLimsDbInstance: ReturnType<typeof drizzle> | undefined;

export const getUsersDb = async () => {
  if (!usersDbInstance) {
    const conn = await createConnection('users');
    usersDbInstance = drizzle(conn, { schema: usersSchema, mode: 'default' });
  }
  return usersDbInstance;
};

export const getEidDb = async () => {
  if (!eidDbInstance) {
    const conn = await createConnection('eid');
    eidDbInstance = drizzle(conn, { schema: eidSchema, mode: 'default' });
  }
  return eidDbInstance;
};

export const getVlLimsDb = async () => {
  if (!vlLimsDbInstance) {
    const conn = await createConnection('vlLims');
    vlLimsDbInstance = drizzle(conn, { schema: vlLimsSchema, mode: 'default' });
  }
  return vlLimsDbInstance;
};

// For backward compatibility, default to users database
export const getDb = getUsersDb;
export const db = getUsersDb();
