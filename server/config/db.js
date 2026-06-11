import mysql from "mysql2/promise";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "toor",
  database: process.env.DB_NAME || "shopping_cart",
  multipleStatements: true
};

// Create a connection pool for the application
// export const pool = mysql.createPool(dbConfig); why not use pool? because we need to create the database if it doesn't exist, and pool doesn't allow multiple statements by default, so we need to create a separate connection for that.
export const getAdminConnection = () =>
  mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true
  });

export const getDbConnection = () => mysql.createConnection(dbConfig);
