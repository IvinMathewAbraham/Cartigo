import api from "@/api/api";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};