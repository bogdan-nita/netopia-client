import { z } from "zod";
import { invalidBrowser, invalidOrder, invalidPayment } from "./errors";

export namespace Browser {
  export const Schema = z.object({
    userAgent: z.string(),
    colorDepth: z.number(),
    language: z.string(),
    screenWidth: z.number(),
    screenHeight: z.number(),
    timeZone: z.string(),
    mobile: z.boolean(),
  });
  export type Data = z.infer<typeof Schema>;
  export const parse = (data: unknown) => {
    try {
      return Schema.parse(data);
    } catch (error) {
      throw invalidBrowser((error as Error).message);
    }
  };
}

export namespace Order {
  export const Schema = z.object({
    posSignature: z.string(),
    amount: z.number().positive(),
    currency: z.string().default("RON"),
    orderID: z.string(),
    billing: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string(),
      city: z.string().optional(),
      country: z.number().default(642),
    }),
    products: z.array(Product.Schema),
  });

  export type Data = z.infer<typeof Schema>;
  export const parse = (data: unknown) => {
    try {
      return Schema.parse(data);
    } catch (error) {
      throw invalidOrder((error as Error).message);
    }
  };
}

export namespace Payment {
  export const Schema = z.object({
    account: z.string(),
    expMonth: z.number().min(1).max(12),
    expYear: z.number().int().min(new Date().getFullYear()),
    secretCode: z.string(),
  });
  export type Data = z.infer<typeof Schema>;
  export const parse = (data: unknown) => {
    try {
      return Schema.parse(data);
    } catch (error) {
      throw invalidPayment((error as Error).message);
    }
  };
}

export namespace Product {
  export const Schema = z.object({
    category: z.string().default("No Category"),
    code: z.string().default("No Code"),
    name: z.string().default("Unnamed Product"),
    price: z.number().nonnegative().default(0),
    vat: z.number().nonnegative().default(0),
  });

  export type Data = z.infer<typeof Schema>;
  export const parse = (data: unknown) => {
    try {
      return Schema.parse(data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
}
