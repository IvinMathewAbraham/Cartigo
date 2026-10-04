const PAYMENT_PROVIDERS = {
  MOCK: "MOCK",
};

const createPaymentError = (message) => {
  const error = new Error(message);
  error.statusCode = 402;
  return error;
};

/**
 * Provider boundary for checkout payments. A real provider can be added
 * later without changing the order service or checkout API contract.
 */
export const authorizePayment = async ({
  provider = PAYMENT_PROVIDERS.MOCK,
  amount,
  paymentDetails = {},
}) => {
  if (provider !== PAYMENT_PROVIDERS.MOCK) {
    throw createPaymentError(`Payment provider "${provider}" is not configured`);
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw createPaymentError("Payment amount must be greater than zero");
  }

  if (paymentDetails.outcome === "failure" || paymentDetails.cardLast4 === "0002") {
    throw createPaymentError(
      "Mock payment failed. Choose a different test card or retry the payment."
    );
  }

  const reference = `MOCK-${Date.now()}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  return {
    provider,
    status: "PAID",
    reference,
  };
};

export { PAYMENT_PROVIDERS };
