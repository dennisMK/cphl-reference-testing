import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  text,
  tinyint,
  unique,
} from "drizzle-orm/mysql-core";

// Auto-generated users schema from drizzle-kit pull
export const users = mysqlTable(
  "users",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }),
    password: varchar({ length: 60 }).notNull(),
    rememberToken: varchar("remember_token", { length: 100 }),
    createdAt: timestamp("created_at", { mode: "string" })
      .default("current_timestamp()")
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .default("current_timestamp()")
      .notNull(),
    username: varchar({ length: 64 }).notNull(),
    telephone: varchar({ length: 64 }),
    facilityId: int("facility_id"),
    facilityName: text("facility_name"),
    hubId: int("hub_id"),
    hubName: varchar("hub_name", { length: 255 }),
    deactivated: tinyint().default(0).notNull(),
    otherFacilities: text("other_facilities"),
    ipId: int("ip_id"),
    ipName: varchar("ip_name", { length: 255 }),
    requestingFacilityId: int("requesting_facility_id"),
  },
  (table) => [unique("users_username_unique").on(table.username)]
);

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

export type NewUser = typeof users.$inferInsert;
