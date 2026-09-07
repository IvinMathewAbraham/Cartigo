// services/product.service.js

import prisma from "../config/client.js";

export const getProductDetailsById = async (id) => {
  return prisma.product.findFirst({
    where: {
      id: BigInt(id),
      is_active: true,
    },

    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          display_order: "asc",
        },
      },

      variants: {
        where: {
          is_active: true,
        },

        include: {
          inventory: true,

          attributes: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      },
    },
  });
};


export const getProducts = async ({
  page = 1,
  limit = 12,
  search = "",
}) => {
  const skip = (page - 1) * limit;

  const where = {
    is_active: true,
  };

  if (search.trim()) {
    where.name = {
      contains: search.trim(),
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,

      include: {
        brand: true,

        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },

        variants: {
          where: {
            is_active: true,
          },

          take: 1,

          include: {
            inventory: true,
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    total,
    page,
    limit,
  };
};
export const createProduct = async (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      is_active: true,

      brand: {
        connect: {
          id: BigInt(data.brandId),
        },
      },

      category: {
        connect: {
          id: BigInt(data.categoryId),
        },
      },
    },
  });
};

export const updateProduct = async (
  id,
  data
) => {
  return prisma.product.update({
    where: {
      id: BigInt(id),
    },

    data: {
      ...(data.name && {
        name: data.name,
      }),

      ...(data.slug && {
        slug: data.slug,
      }),

      ...(data.description && {
        description:
          data.description,
      }),
    },
  });
};

export const deactivateProduct = async (
  id
) => {
  return prisma.product.update({
    where: {
      id: BigInt(id),
    },

    data: {
      is_active: false,
    },
  });
};

export const createProductImage = async (
  productId,
  imageUrl
) => {
  const existingImage =
    await prisma.productImage.findFirst({
      where: {
        productId: BigInt(productId),
      },
    });

  return prisma.productImage.create({
    data: {
      url: imageUrl,

      isPrimary: !existingImage,

      product: {
        connect: {
          id: BigInt(productId),
        },
      },
    },
  });
};


export const createAttribute = async (data) => {
  const existing =
    await prisma.productAttribute.findFirst({
      where: {
        name: data.name,
      },
    });

  if (existing) {
    throw new Error(
      "Attribute already exists"
    );
  }

  return prisma.productAttribute.create({
    data: {
      name: data.name,
    },
  });
};

export const createAttributeValue = async (
  data
) => {
  return prisma.productAttributeValue.create({
    data: {
      value: data.value,

      attribute: {
        connect: {
          id: BigInt(
            data.attributeId
          ),
        },
      },
    },
  });
};

export const createVariant = async (
  productId,
  data
) => {
  return prisma.$transaction(async (tx) => {
    const variant =
      await tx.productVariant.create({
        data: {
          product: {
            connect: {
              id: BigInt(productId),
            },
          },

          sku: data.sku,

          price: data.price,

          is_active: true,
        },
      });

    if (
      data.attributeValueIds?.length
    ) {
      await tx.variantAttributeValue.createMany({
        data:
          data.attributeValueIds.map(
            (attributeValueId) => ({
              variantId: variant.id,
              attributeValueId:
                BigInt(attributeValueId),
            })
          ),
      });
    }

    const initialStock = Number(data.stock ?? data.stockLevel ?? data.quantity ?? 0);
    await tx.inventory.create({
      data: {
        variant_id: variant.id,
        quantity: initialStock,
      },
    });

    return variant;
  });
};


export const setPrimaryImage = async (
  imageId
) => {
  const image =
    await prisma.productImage.findUnique({
      where: {
        id: BigInt(imageId),
      },
    });

  if (!image) {
    throw new Error("Image not found");
  }

  await prisma.productImage.updateMany({
    where: {
      productId: image.productId,
    },

    data: {
      isPrimary: false,
    },
  });

  return prisma.productImage.update({
    where: {
      id: BigInt(imageId),
    },

    data: {
      isPrimary: true,
    },
  });
};