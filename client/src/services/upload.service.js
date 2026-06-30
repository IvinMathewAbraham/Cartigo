import api from "@/api/api";

export const uploadImages = async (formData) => {
  const { data } = await api.post("/admin/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};