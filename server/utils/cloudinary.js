// utils/cloudinary.js

import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        console.log("ERROR:", error);
        console.log("RESULT:", result);

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.on("error", (err) => {
      console.log("STREAM ERROR:");
      console.dir(err, { depth: null });
    });

    stream.end(buffer);
  });
};