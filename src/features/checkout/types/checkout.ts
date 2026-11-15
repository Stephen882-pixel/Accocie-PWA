import type { Address } from "@/features/addresses/types/address";

// Money arrives as decimal strings, as the API sends them.

export interface CheckoutLine {
  productId: string;
  variantId: string | null;
  productName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: string;
}

export interface CheckoutSummary {
  items: CheckoutLine[];
  subtotal: string;
  /** 16% VAT on the subtotal. */
  taxAmount: string;
  shippingCost: string;
  totalAmount: string;
}

export type PaymentMethod =
  "cash_on_delivery" | "mobile_money" | "card" | "bank_transfer";

export interface PlaceOrderPayload {
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

/** The parts of the created order the confirmation screen shows. */
export interface PlacedOrder {
  id: string;
  orderNumber: string;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
}
