import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schemas/eid.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL_EID,
  },
} satisfies Config; 