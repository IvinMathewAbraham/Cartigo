import { getDbConnection, dbConfig } from "../config/db.js";
import { resolveSqlPath, runSqlFile } from "./dbUtils.js";

const run = async () => {
  const schemaPath = resolveSqlPath("schema.sql");
  const connection = await getDbConnection();

  try {
    await runSqlFile(connection, schemaPath);
    console.log(`Schema applied to database: ${dbConfig.database}`);
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
