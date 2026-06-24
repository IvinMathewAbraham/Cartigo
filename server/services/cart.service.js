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
  itemId,
  quantity
) => {
  const cartItem =
    await prisma.cartItem.findUnique({
      where: {
        id: BigInt(itemId),
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
      "Cart item not found"
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
      id: BigInt(itemId),
    },

    data: {
      quantity,
    },
  });
};

export const removeCartItem = async (itemId) => {
    const item =
      await prisma.cartItem.findUnique({
        where: {
          id: BigInt(itemId),
        },
      });

    if (!item) {
      throw new Error(
        "Cart item not found"
      );
    }

    return prisma.cartItem.delete({
      where: {
        id: BigInt(itemId),
      },
    });
  };