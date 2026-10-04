// client/src/api/order.js

import api from "./api";

export const createOrder = async () => {
  const response = await api.post("/orders");
  return response.data;
};

export const checkout = async (data) => {
  const response = await api.post("/orders/checkout", data);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getOrderReceipt = async (id) => {
  const response = await api.get(`/orders/${id}/receipt`);
  return response.data;
};

export const getShippingMethods = async () => {
  const response = await api.get("/shipping");
  return response.data;
};
