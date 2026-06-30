import api from "@/api/api";

export const createInventory = async (variantId, payload) => {
  const { data } = await api.post(
    `/admin/inventory/variants/${variantId}/inventory`,
    payload
  );

  return data;
};

export const updateInventory = async (variantId, payload) => {
  const { data } = await api.put(
    `/admin/inventory/variants/${variantId}/inventory`,
    payload
  );

  return data;
};