import { getDbConnection, dbConfig } from "../config/db.js";
import { resolveSqlPath, runSqlFile } from "./dbUtils.js";

const run = async () => {
  const seedPath = resolveSqlPath("seed.sql");
  const connection = await getDbConnection();

  try {
    await runSqlFile(connection, seedPath);
    console.log(`Seed data applied to database: ${dbConfig.database}`);
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
