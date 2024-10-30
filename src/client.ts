import axios from "axios";
import dotenv from "dotenv";
import { Payment, Browser, Order, Product } from "./schemas";
import { failedPaymentStart, missingField } from "./errors";

dotenv.config();

export class Netopia {
  private client: Axios.AxiosInstance;
  private apiKey: string;
  private notifyUrl: string;
  private redirectUrl: string;
  private sandbox: boolean;
  private paymentData?: Payment.Data;
  private browserInfo?: Browser.Data;
  private orderData?: Partial<Order.Data>;

  constructor({
    apiKey = process.env.NETOPIA_API_KEY,
    notifyUrl = process.env.NETOPIA_CONFIRM_URL,
    redirectUrl = process.env.NETOPIA_RETURN_URL,
    sandbox = process.env.NODE_ENV !== "production",
  }: {
    apiKey?: string;
    notifyUrl?: string;
    redirectUrl?: string;
    sandbox?: boolean;
  } = {}) {
    if (!apiKey) throw missingField("API key");
    if (!notifyUrl) throw missingField("Notify URL");
    if (!redirectUrl) throw missingField("Redirect URL");

    this.apiKey = apiKey;
    this.notifyUrl = notifyUrl;
    this.redirectUrl = redirectUrl;
    this.sandbox = sandbox;
    this.client = axios.create({
      baseURL: sandbox
        ? "https://secure.sandbox.netopia-payments.com"
        : "https://secure.mobilpay.ro/pay",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  setPaymentData(data: Payment.Data) {
    this.paymentData = Payment.parse(data);
    return this;
  }

  setBrowserInfo(data: Browser.Data) {
    this.browserInfo = Browser.parse(data);
    return this;
  }

  setOrderData(data: Order.Data) {
    this.orderData = Order.parse(data);
    return this;
  }

  async startPayment() {
    if (!this.paymentData) throw missingField("Payment data");
    if (!this.browserInfo) throw missingField("Browser info");
    if (!this.orderData) throw missingField("Order data");

    const payload = {
      config: {
        notifyUrl: this.notifyUrl,
        redirectUrl: this.redirectUrl,
        language: "ro",
      },
      payment: this.paymentData,
      browserInfo: this.browserInfo,
      order: this.orderData,
    };

    try {
      const { data } = await this.client.post("/payment/card/start", payload);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw failedPaymentStart(message);
    }
  }

  setProductsData(products: Product.Data[]) {
    if (!Array.isArray(products) || products.length === 0) {
      throw invalidProductsData("Product data is required");
    }

    this.orderData = {
      ...this.orderData,
      products: products.map((product) => Product.parse(product)),
    };
    return this;
  }
}
function invalidProductsData(arg0: string) {
  throw new Error("Function not implemented.");
}
