// controllers/category.controller.js

import { getCategories } from "../services/category.service.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      success: true,
      data: categories.map(category => ({
        ...category,
        id: category.id.toString(),
        parentId: category.parentId?.toString() ?? null,
      })),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};