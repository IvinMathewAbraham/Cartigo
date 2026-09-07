import prisma from "../config/client.js";

export const addToCart = async (
    userId,
    variantId,
    quantity
) => {
    const inventory =
        await prisma.inventory.findUnique({
            where: {
                variant_id:
                    BigInt(variantId),
            },
        });

    if (!inventory) {
        throw new Error(
            "Inventory not found"
        );
    }

    if (
        inventory.quantity <
        quantity
    ) {
        throw new Error(
            "Insufficient stock"
        );
    }


    let cart =
        await prisma.cart.findFirst({
            where: {
                userId: BigInt(userId),
            },
        });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                user: {
                    connect: {
                        id: BigInt(userId),
                    },
                },
            },
        });
    }

    const existingItem =
        await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                variantId:
                    BigInt(variantId),
            },
        });

    if (existingItem) {
        return prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },

            data: {
                quantity:
                    existingItem.quantity +
                    quantity,
            },
        });
    }

    return prisma.cartItem.create({
        data: {
            cart: {
                connect: {
                    id: cart.id,
                },
            },

            variant: {
                connect: {
                    id: BigInt(variantId),
                },
            },

            quantity,
        },
    });
};

export const getCart = async (
  userId
) => {
  return prisma.cart.findFirst({
    where: {
      userId: BigInt(userId),
    },

    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: {
                    where: {
                      isPrimary: true,
                    },
                  },
                },
              },

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
      },
    },
  });
};

export const updateCartItem = async (
  userId,
  itemId,
  quantity
) => {
  const cartItem =
    await prisma.cartItem.findFirst({
      where: {
        id: BigInt(itemId),
        cart: {
          userId: BigInt(userId),
        },
      },

      include: {
        variant: {
          include: {
            inventory: true,
          },
        },
      },
    });

  if (!cartItem) {
    throw new Error(
      "Cart item not found or unauthorized"
    );
  }

  if (
    !cartItem.variant.inventory
  ) {
    throw new Error(
      "Inventory not found"
    );
  }

  if (
    quantity >
    cartItem.variant.inventory
      .quantity
  ) {
    throw new Error(
      "Insufficient stock"
    );
  }

  return prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },

    data: {
      quantity,
    },
  });
};

export const removeCartItem = async (userId, itemId) => {
  const item =
    await prisma.cartItem.findFirst({
      where: {
        id: BigInt(itemId),
        cart: {
          userId: BigInt(userId),
        },
      },
    });

  if (!item) {
    throw new Error(
      "Cart item not found or unauthorized"
    );
  }

  return prisma.cartItem.delete({
    where: {
      id: item.id,
    },
  });
};