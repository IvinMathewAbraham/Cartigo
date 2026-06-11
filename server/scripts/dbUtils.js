import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const resolveSqlPath = (fileName) =>
  path.join(__dirname, "..", "..", "database", fileName);

export const runSqlFile = async (connection, filePath) => {
  const sql = await fs.readFile(filePath, "utf8");
  if (!sql.trim()) {
    throw new Error(`SQL file is empty: ${filePath}`);
  }
  await connection.query(sql);
};
