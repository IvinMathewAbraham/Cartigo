import api from "@/api/api";

export const getBrands = async () => {
  const { data } = await api.get("/brands");
  return data;
};