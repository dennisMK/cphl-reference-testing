import { type Config } from "drizzle-kit";

export default {
  schema: "./src/server/db/schemas/users.ts",
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://root@localhost:3306/etest_users",
  },
} satisfies Config; 