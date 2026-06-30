// controllers/brand.controller.js

import { getBrands } from "../services/brand.service.js";

export const getAllBrands = async (req, res) => {
  try {
    const brands = await getBrands();

    return res.status(200).json({
      success: true,
      data: brands.map(brand => ({
        ...brand,
        id: brand.id.toString(),
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