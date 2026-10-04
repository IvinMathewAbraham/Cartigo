import { createReturnRequest, getReturns } from "../services/return.service.js";

export const createReturnController = async (req, res) => {
  try {
    const result = await createReturnRequest(req.user.id, req.params.orderId, req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export const getReturnsController = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await getReturns(req.user.id) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
