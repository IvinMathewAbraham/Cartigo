// product.controller.js

import prisma from "../config/client.js";
import { getProductDetailsById, getProducts, createProduct, updateProduct, deactivateProduct, createProductImage, createAttribute,createAttributeValue, createVariant,setPrimaryImage } from "../services/product.service.js";

// need to add prisma.transaction for multiple queries in a single request

// GET /api/products/:id
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await getProductDetailsById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const response = {
      id: product.id.toString(),

      name: product.name,
      slug: product.slug,
      description: product.description,

      brand: product.brand
        ? {
          id: product.brand.id.toString(),
          name: product.brand.name,
        }
        : null,

      category: product.category
        ? {
          id: product.category.id.toString(),
          name: product.category.name,
          slug: product.category.slug,
        }
        : null,

      images: product.images.map((image) => ({
        id: image.id.toString(),
        url: image.url,
        altText: image.alt_text,
        isPrimary: image.isPrimary,
      })),

      variants: product.variants.map((variant) => ({
        id: variant.id.toString(),

        sku: variant.sku,

        price: Number(variant.price),

        stock: variant.inventory?.quantity || 0,

        attributes: variant.attributes.map((attr) => ({
          attribute:
            attr.attributeValue.attribute.name,

          value:
            attr.attributeValue.value,
        })),
      })),
    };

    return res.status(200).json({
      success: true,
      data: response,
    });

    
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = req.query.search || "";
    const categoryId = req.query.categoryId || null;
    const brandId = req.query.brandId || null;
    const minPrice = req.query.minPrice || null;
    const maxPrice = req.query.maxPrice || null;
    const sortBy = req.query.sortBy || "newest";

    const result = await getProducts({
      page,
      limit,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/admin/products
export const createProductController = async (req, res) => {
  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/admin/products/:id
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await updateProduct(
        id,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/admin/products/:id/deactivate
export const deactivateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await deactivateProduct(id);

    return res.status(200).json({
      success: true,
      message:
        "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  POST /api/admin/products/:id/images
export const uploadProductImage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Image required",
      });
    }

    const imageUrl =
      `/uploads/products/${req.file.filename}`;

    const image =
      await createProductImage(
        id,
        imageUrl
      );

    return res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//PATCH /api/admin/products/images/:imageId/primary  
export const setPrimaryProductImage =
  async (req, res) => {
    try {
      const { imageId } = req.params;

      const image =
        await setPrimaryImage(
          imageId
        );

      return res.json({
        success: true,
        data: image,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// POST /api/admin/products/attributes
export const createAttributeController = async (req, res) => {
    try {
      const attribute =
        await createAttribute(
          req.body
        );

      return res.status(201).json({
        success: true,
        data: attribute,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // POST /api/admin/products/attribute-values 
export const createAttributeValueController = async (req, res) => {
    try {
      const {
        attributeId,
        value,
      } = req.body;

      if (
        !attributeId ||
        !value
      ) {
        return res.status(400).json({
          success: false,
          message:
            "attributeId and value are required",
        });
      }

      const attributeValue =
        await createAttributeValue(
          {
            attributeId,
            value,
          }
        );

      return res.status(201).json({
        success: true,
        data: attributeValue,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// POST /api/admin/products/:id/variants
export const createVariantController = async (req, res) => {
    try {
      const { id } = req.params;

      const {
        sku,
        price,
        attributeValueIds,
      } = req.body;

      const variant =
        await createVariant(id, {
          sku,
          price,
          attributeValueIds,
        });

      return res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };