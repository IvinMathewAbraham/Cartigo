const shippingMethods = {
  STANDARD: { code: "STANDARD", name: "Standard delivery", fee: 0, minDays: 4, maxDays: 7 },
  EXPRESS: { code: "EXPRESS", name: "Express delivery", fee: 99, minDays: 1, maxDays: 2 },
};

export const getShippingMethods = () =>
  Object.values(shippingMethods).map((method) => ({
    ...method,
    estimatedDelivery: getDeliveryWindow(method),
  }));

export const getShippingMethod = (code = "STANDARD") => {
  const method = shippingMethods[code];
  if (!method) {
    const error = new Error("Unsupported shipping method");
    error.statusCode = 400;
    throw error;
  }
  return { ...method, estimatedDelivery: getDeliveryWindow(method) };
};

const getDeliveryWindow = ({ minDays, maxDays }) => {
  const start = new Date();
  start.setDate(start.getDate() + minDays);
  const end = new Date();
  end.setDate(end.getDate() + maxDays);
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
};
