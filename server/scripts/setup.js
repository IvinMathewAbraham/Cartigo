/**
 * @deprecated This legacy setup script has been deprecated in favor of Prisma migrations.
 * Use `npm run db:setup` / `npx prisma migrate dev` and `npm run db:seed` instead.
 */

import {
  getAdminConnection,
  getDbConnection,
  dbConfig
} from "../config/db.js";
import { resolveSqlPath, runSqlFile } from "./dbUtils.js";

const run = async () => {
  const schemaPath = resolveSqlPath("schema.sql");
  const seedPath = resolveSqlPath("seed.sql");

  const adminConnection = await getAdminConnection();
  try {
    await adminConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
    );
  } finally {
    await adminConnection.end();
  }

  const connection = await getDbConnection();
  try {
    await runSqlFile(connection, schemaPath);
    await runSqlFile(connection, seedPath);
    console.log(`Database ready: ${dbConfig.database}`);
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error("Database setup failed:", error.message);
  process.exit(1);
});
