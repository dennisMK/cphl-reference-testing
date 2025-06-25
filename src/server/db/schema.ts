import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  text,
  tinyint,
} from "drizzle-orm/mysql-core";

// Users table matching the existing etest_users.users structure
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 60 }).notNull(),
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
  remember_token: varchar("remember_token", { length: 100 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
