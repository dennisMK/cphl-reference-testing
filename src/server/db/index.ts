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

const createConnection = async (database: string): Promise<mysql.Connection> => {
  const dbUrl = env.DATABASE_URL.replace(/\/[^\/]*$/, `/${database}`);
  
  const existingConn = globalForDb[`${database === 'etest_users' ? 'users' : database === 'etest_eid' ? 'eid' : 'vlLims'}Conn` as keyof typeof globalForDb] as mysql.Connection;
  if (existingConn) {
    return existingConn;
  }
  
  const dbKey = database === 'etest_users' ? 'users' : database === 'etest_eid' ? 'eid' : 'vlLims';
  if (globalForDb.promises[dbKey as keyof typeof globalForDb.promises]) {
    return globalForDb.promises[dbKey as keyof typeof globalForDb.promises]!;
  }
  
  globalForDb.promises[dbKey as keyof typeof globalForDb.promises] = mysql.createConnection(dbUrl);
  const conn = await globalForDb.promises[dbKey as keyof typeof globalForDb.promises]!;
  
  if (env.NODE_ENV !== "production") {
    if (database === 'etest_users') globalForDb.usersConn = conn;
    if (database === 'etest_eid') globalForDb.eidConn = conn;
    if (database === 'etest_vl_lims') globalForDb.vlLimsConn = conn;
  }
  
  globalForDb.promises[dbKey as keyof typeof globalForDb.promises] = undefined;
  return conn;
};

// Create database instances
let usersDbInstance: ReturnType<typeof drizzle> | undefined;
let eidDbInstance: ReturnType<typeof drizzle> | undefined;
let vlLimsDbInstance: ReturnType<typeof drizzle> | undefined;

export const getUsersDb = async () => {
  if (!usersDbInstance) {
    const conn = await createConnection('etest_users');
    usersDbInstance = drizzle(conn, { schema: usersSchema, mode: 'default' });
  }
  return usersDbInstance;
};

export const getEidDb = async () => {
  if (!eidDbInstance) {
    const conn = await createConnection('etest_eid');
    eidDbInstance = drizzle(conn, { schema: eidSchema, mode: 'default' });
  }
  return eidDbInstance;
};

export const getVlLimsDb = async () => {
  if (!vlLimsDbInstance) {
    const conn = await createConnection('etest_vl_lims');
    vlLimsDbInstance = drizzle(conn, { schema: vlLimsSchema, mode: 'default' });
  }
  return vlLimsDbInstance;
};

// For backward compatibility, default to users database
export const getDb = getUsersDb;
export const db = getUsersDb();
