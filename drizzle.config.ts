import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/shared/config";

const config = readConfig();

export default defineConfig({
  schema: "src/shared/db/schema.ts",
  out: "src/shared/db",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});
