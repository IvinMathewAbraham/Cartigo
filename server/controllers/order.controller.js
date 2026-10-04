import prisma from "../config/client.js";
import { createOrder, getOrders, getOrderById, updateOrderStatus, getAllOrders, getOrderDetails } from "../services/order.service.js";


//POST /api/orders
export const createOrderController = async (req, res) => {
  try {
    const order = await createOrder(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    const status = error.statusCode || (error.message.includes("Cart is empty") ? 400 : 500);
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkoutController = async (req, res) => {
  try {
    const order = await createOrder(req.user.id, req.body, {
      requireAddress: true,
    });

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    const status = error.statusCode || (error.message?.includes("Cart is empty") ? 400 : 500);
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/orders
export const getOrdersController = async (req, res) => {
  try {
    const orders =
      await getOrders(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET /api/orders/:id
export const getOrderByIdController = async (req, res) => {
  try {
    const order =
      await getOrderById(
        req.params.id,
        req.user.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderReceiptController = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({
      success: true,
      data: {
        receiptNumber: `RECEIPT-${order.id.toString()}`,
        orderId: order.id,
        paidAt: order.createdAt,
        paymentReference: order.payment_reference,
        paymentStatus: order.payment_status,
        total: order.totalAmount,
        items: order.items,
        shipping: order.shipping,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/orders/:id/status   
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } =
      req.params;

    const { status } =
      req.body;

    const order =
      await updateOrderStatus(
        id,
        status
      );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/admin/orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders =
      await getAllOrders();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOrderDetailsController = async (req, res) => {
    try {
      const order =
        await getOrderDetails(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };