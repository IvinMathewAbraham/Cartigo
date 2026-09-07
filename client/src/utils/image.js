import { API_URL } from "../config/config.js";

export const getImageUrl = (url) => {
  if (!url) return "";

  return url.startsWith("http")
    ? url
    : `${API_URL || ""}${url.startsWith("/") ? url : `/${url}`}`;
};