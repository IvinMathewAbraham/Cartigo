// test-cloudinary.js

import dotenv from "dotenv";
dotenv.config();

import cloudinary from "../Shopping-Cart/server/config/cloudinary.js";

try {
  const result = await cloudinary.api.ping();
  console.log(result);
} catch (err) {
  console.dir(err, { depth: null });
}