// client/src/services/product.service.js

import api from "@/api/api";

export const getProducts = async ({
  page = 1,
  limit = 12,
  search = "",
} = {}) => {
  const response = await api.get(
    `/products?page=${page}&limit=${limit}&search=${search}`
  );

  return response.data;
};

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = async (productData) => {
  const response = await api.post("/admin/products", productData);
  return response.data;
};

export const updateProduct = (id, productData) =>
  api.put(`/admin/products/${id}`, productData);

export const deleteProduct = (id) =>
  api.patch(`/admin/products/${id}/deactivate`);

export const getProductVariants = (productId) =>
  api.get(`/products/${productId}/variants`);

export const createVariant = (productId, variantData) =>
  api.post(`/admin/products/${productId}/variants`, variantData);

export const updateProductVariant = (productId, variantId, variantData) =>
  api.put(`/admin/products/${productId}/variants/${variantId}`, variantData);

export const deleteProductVariant = (productId, variantId) =>
  api.delete(`/admin/products/${productId}/variants/${variantId}`);

export const createProductImage = (productId, imageData) => {
  if (imageData instanceof FormData) {
    return api.post(`/admin/products/${productId}/images`, imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return api.post(`/admin/products/${productId}/images`, { imageUrl: imageData });
};