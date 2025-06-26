import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schemas/*",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["uganda-viral-load-manager_*"],
} satisfies Config;
