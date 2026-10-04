import { getShippingMethods } from "../services/shipping.service.js";

export const getShippingMethodsController = (req, res) =>
  res.status(200).json({ success: true, data: getShippingMethods() });
