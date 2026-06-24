import prisma from "../config/client.js";


export const addToWishlist = async (userId, variantId) => {

    let wishlist =
      await prisma.wishlist.findFirst({
        where: {
          user_id: BigInt(userId),
        },
      });

    if (!wishlist) {
      wishlist =
        await prisma.wishlist.create({
          data: {
            user: {
              connect: {
                id: BigInt(userId),
              },
            },
          },
        });
    }

    const existing =
      await prisma.wishlist_item.findFirst({
        where: {
          wishlist_id: wishlist.id,
          variant_id: BigInt(variantId),
        },
      });

    if (existing) {
      throw new Error(
        "Item already in wishlist"
      );
    }

    return prisma.wishlist_item.create({
      data: {
        wishlist: {
          connect: {
            id: wishlist.id,
          },
        },

        product_variant: {
          connect: {
            id: BigInt(variantId),
          },
        },
      },
    });
  };

export const getWishlist = async (
  userId
) => {
  return prisma.wishlist.findFirst({
    where: {
      user_id: BigInt(userId),
    },

    include: {
      wishlist_item: {
        include: {
          product_variant: {
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

export const removeWishlistItem = async (itemId) => {
    return prisma.wishlist_item.delete({
      where: {
        id: BigInt(itemId),
      },
    });
  };