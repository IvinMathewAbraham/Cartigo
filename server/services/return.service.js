import prisma from "../config/client.js";

export const createReturnRequest = async (userId, orderId, data) => {
  const order = await prisma.order.findFirst({
    where: { id: BigInt(orderId), userId: BigInt(userId) },
    include: { items: true },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (!["CONFIRMED", "SHIPPED", "DELIVERED"].includes(order.status)) {
    const error = new Error("This order is not eligible for return");
    error.statusCode = 400;
    throw error;
  }

  const items = data.items || [];
  if (!items.length || !data.reason?.trim()) {
    const error = new Error("Return reason and at least one order item are required");
    error.statusCode = 400;
    throw error;
  }

  const validItems = items.map((item) => {
    const orderItem = order.items.find((candidate) => candidate.id.toString() === String(item.orderItemId));
    if (!orderItem || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > orderItem.quantity) {
      const error = new Error("Invalid return item or quantity");
      error.statusCode = 400;
      throw error;
    }
    return { orderItemId: orderItem.id, quantity: item.quantity };
  });

  return prisma.return_request.create({
    data: {
      user_id: BigInt(userId),
      order_id: BigInt(orderId),
      reason: data.reason.trim(),
      return_request_item: { create: validItems },
    },
    include: { return_request_item: true },
  });
};

export const getReturns = (userId) =>
  prisma.return_request.findMany({
    where: { user_id: BigInt(userId) },
    include: { refund: true, return_request_item: true, orders: true },
    orderBy: { created_at: "desc" },
  });

export const updateReturnStatus = async (adminId, returnId, status) => {
  const request = await prisma.return_request.findUnique({
    where: { id: BigInt(returnId) },
    include: { orders: true },
  });
  if (!request) {
    const error = new Error("Return request not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.return_request.update({
      where: { id: BigInt(returnId) },
      data: { status },
    });

    await tx.return_request_history.create({
      data: {
        return_request_id: BigInt(returnId),
        old_status: request.status || "PENDING",
        new_status: status,
        changed_by: BigInt(adminId),
      },
    });

    if (status === "APPROVED") {
      await tx.refund.upsert({
        where: { return_request_id: BigInt(returnId) },
        update: { status: "APPROVED" },
        create: {
          return_request_id: BigInt(returnId),
          amount: request.orders.totalAmount,
          status: "APPROVED",
        },
      });
    }

    if (status === "COMPLETED") {
      await tx.refund.update({
        where: { return_request_id: BigInt(returnId) },
        data: { status: "COMPLETED" },
      });
    }

    return updated;
  });
};
