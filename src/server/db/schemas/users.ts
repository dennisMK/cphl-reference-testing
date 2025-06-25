import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  text,
  tinyint,
} from "drizzle-orm/mysql-core";

// Users table from etest_users database - matches exact database schema
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 60 }).notNull(),
  remember_token: varchar("remember_token", { length: 100 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  telephone: varchar("telephone", { length: 64 }),
  facility_id: int("facility_id"),
  facility_name: text("facility_name"),
  hub_id: int("hub_id"),
  hub_name: varchar("hub_name", { length: 255 }),
  deactivated: tinyint("deactivated").default(0).notNull(),
  other_facilities: text("other_facilities"),
  ip_id: int("ip_id"),
  ip_name: varchar("ip_name", { length: 255 }),
  requesting_facility_id: int("requesting_facility_id"),
});

// Type for the complete user object from database
export type User = typeof users.$inferSelect;

// Type for user data returned by API (subset of full user)
export type ApiUser = {
  id: number;
  username: string;
  name: string;
  email: string | null;
  telephone: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
  other_facilities: string | null;
  ip_id: number | null;
  ip_name: string | null;
  requesting_facility_id: number | null;
}; 