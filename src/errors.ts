export class NetopiaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetopiaError";
  }
}
export function missingField(fieldName: string) {
  return new NetopiaError(`Missing required field: ${fieldName}`);
}

export function invalidPayment(message: string) {
  return new NetopiaError(`Invalid payment data: ${message}`);
}

export function invalidBrowser(message: string) {
  return new NetopiaError(`Invalid browser data: ${message}`);
}

export function invalidOrder(message: string) {
  return new NetopiaError(`Invalid order data: ${message}`);
}

export function invalidProducts(message: string) {
  return new NetopiaError(`Invalid product data: ${message}`);
}

export function failedPaymentStart(message: string) {
  return new NetopiaError(`Failed to start payment: ${message}`);
}
