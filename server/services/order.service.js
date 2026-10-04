import prisma from "../config/client.js";
import { authorizePayment, PAYMENT_PROVIDERS } from "./payment.service.js";
import { getShippingMethod } from "./shipping.service.js";

export const createOrder = async (
    userId,
    orderData = {},
    options = {}
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
                const error = new Error("Cart is empty");
                error.statusCode = 400;
                throw error;
            }

            let totalAmount = 0;

            for (const item of cart.items) {
                totalAmount +=
                    Number(item.variant.price) * item.quantity;
            }

            const shipping = getShippingMethod(orderData.shippingMethod);
            totalAmount += shipping.fee;

            if (options.requireAddress) {
                const address = await tx.address.findFirst({
                    where: {
                        id: BigInt(orderData.addressId),
                        userId: BigInt(userId),
                    },
                });

                if (!address) {
                    const error = new Error("Shipping address not found");
                    error.statusCode = 400;
                    throw error;
                }
            }

            const payment = await authorizePayment({
                provider: orderData.paymentProvider || PAYMENT_PROVIDERS.MOCK,
                amount: totalAmount,
                paymentDetails: orderData.paymentDetails,
            });

            // Create Order record
            const order =
                await tx.order.create({
                    data: {
                        userId: BigInt(userId),
                        address_id: orderData.addressId ? BigInt(orderData.addressId) : null,
                        delivery_contact: orderData.deliveryContact || null,
                        payment_status: payment.status,
                        payment_reference: payment.reference,
                        totalAmount,
                        status: "PENDING",
                    },
                });

            // Atomically decrement stock and create order items
            for (const item of cart.items) {
                const rowsUpdated = await tx.$executeRaw`
                    UPDATE inventory 
                    SET quantity = quantity - ${item.quantity} 
                    WHERE variant_id = ${item.variant.id} AND quantity >= ${item.quantity};
                `;

                if (rowsUpdated === 0) {
                    const error = new Error(
                        `Insufficient stock for ${item.variant.sku || item.variant.product?.name || "variant"}`
                    );
                    error.statusCode = 409;
                    throw error;
                }

                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        variantId: item.variant.id,
                        sku: item.variant.sku,
                        productName: item.variant.product.name,
                        quantity: item.quantity,
                        price: item.variant.price,
                    },
                });
            }

            // Clear Cart
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
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                include: {
                                    images: true,
                                },
                            },
                        },
                    },
                },
            },
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
    const order = await prisma.order.findFirst({
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
    return order ? { ...order, shipping: getShippingMethod(), tracking: getTracking(order) } : null;
};

const getTracking = (order) => ({
    reference: `CARTIGO-${order.id.toString()}`,
    status: order.status || "PENDING",
    estimatedDelivery: getShippingMethod().estimatedDelivery,
});

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