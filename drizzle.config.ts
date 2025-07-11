import { type Config } from "drizzle-kit";

import { env } from "@/env";

// Main database configuration (Users)
const defaultConfig: Config = {
  schema: "./src/server/db/schemas/users.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./drizzle/users",
};

// VL LIMS database configuration
export const vlLimsConfig: Config = {
  schema: "./src/server/db/schemas/vl_lims.ts",
  dialect: "mysql", 
  dbCredentials: {
    url: env.DATABASE_URL_VL_LIMS,
  },
  out: "./drizzle/vl_lims",
};

// EID database configuration
export const eidConfig: Config = {
  schema: "./src/server/db/schemas/eid.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL_EID,
  },
  out: "./drizzle/eid",
};

export default defaultConfig;
