import prisma from "../config/client.js";

export const createOrder = async (
    userId
) => {
    return prisma.$transaction(
        async (tx) => {

            const cart =
                await tx.cart.findFirst({
                    where: {
                        userId: BigInt(userId),
                    },

                    include: {
                        items: {
                            include: {
                                variant: {
                                    include: {
                                        product: true,
                                        inventory: true,
                                    },
                                },
                            },
                        },
                    },
                });

            if (
                !cart ||
                cart.items.length === 0
            ) {
                throw new Error(
                    "Cart is empty"
                );
            }

            let totalAmount = 0;

            for (const item of cart.items) {

                if (
                    !item.variant.inventory
                ) {
                    throw new Error(
                        `Inventory missing for ${item.variant.sku}`
                    );
                }

                if (
                    item.quantity >
                    item.variant.inventory.quantity
                ) {
                    throw new Error(
                        `Insufficient stock for ${item.variant.sku}`
                    );
                }

                totalAmount +=
                    Number(
                        item.variant.price
                    ) * item.quantity;
            }

            const order =
                await tx.order.create({
                    data: {
                        userId:
                            BigInt(userId),

                        totalAmount,
                    },
                });

            for (const item of cart.items) {

                await tx.orderItem.create({
                    data: {
                        orderId: order.id,

                        variantId:
                            item.variant.id,

                        sku:
                            item.variant.sku,

                        productName:
                            item.variant.product
                                .name,

                        quantity:
                            item.quantity,

                        price:
                            item.variant.price,
                    },
                });

                await tx.inventory.update({
                    where: {
                        variant_id:
                            item.variant.id,
                    },

                    data: {
                        quantity: {
                            decrement:
                                item.quantity,
                        },
                    },
                });
            }

            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });

            return order;
        }
    );
};

export const getOrders = async (
    userId
) => {
    return prisma.order.findMany({
        where: {
            userId: BigInt(userId),
        },

        include: {
            items: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getOrderById = async (
    orderId,
    userId
) => {
    return prisma.order.findFirst({
        where: {
            id: BigInt(orderId),
            userId: BigInt(userId),
        },

        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });
};

export const updateOrderStatus = async (
        orderId,
        newStatus
    ) => {

        return prisma.$transaction(
            async (tx) => {

                const order =
                    await tx.order.findUnique({
                        where: {
                            id: BigInt(orderId),
                        },
                    });

                if (!order) {
                    throw new Error(
                        "Order not found"
                    );
                }

                const oldStatus =
                    order.status;

                const updatedOrder =
                    await tx.order.update({
                        where: {
                            id: BigInt(orderId),
                        },

                        data: {
                            status: newStatus,
                        },
                    });

                await tx.order_status_history.create({
                    data: {
                        order_id:
                            BigInt(orderId),

                        old_status:
                            oldStatus,

                        new_status:
                            newStatus,
                    },
                });

                return updatedOrder;
            }
        );
};

export const getAllOrders = async () => {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        items: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const getOrderDetails =
  async (orderId) => {
    return prisma.order.findUnique({
      where: {
        id: BigInt(orderId),
      },

      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },

        order_status_history: {
          orderBy: {
            changed_at: "desc",
          },
        },
      },
    });
  };