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

export const createProduct = (productData) =>
  api.post("/products", productData);

export const updateProduct = (id, productData) =>
  api.put(`/products/${id}`, productData);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

export const getProductVariants = (productId) =>
  api.get(`/products/${productId}/variants`);

export const createVariant = (productId, variantData) =>
  api.post(`/products/${productId}/variants`, variantData);

export const updateProductVariant = (productId, variantId, variantData) =>
  api.put(`/products/${productId}/variants/${variantId}`, variantData);

export const deleteProductVariant = (productId, variantId) =>
  api.delete(`/products/${productId}/variants/${variantId}`);

export const createProductImage = (productId, imageData) =>
  api.post(`/products/${productId}/images`, imageData);