// client/src/services/product.service.js

import api from "@/api/api";

export const getProducts = async ({
  page = 1,
  limit = 12,
  search = "",
}) => {
  const response = await api.get(
    `/products?page=${page}&limit=${limit}&search=${search}`
  );

  return response.data;
};

export const getProductById = (id) =>
  api.get(`/products/${id}`);