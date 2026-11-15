import type { Address } from "@/features/addresses/types/address";
import type { PaymentMethod } from "@/features/checkout/types/checkout";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  vendor?: { id: string; firstName: string; lastName: string };
}

/** What the order list returns. Money as decimal strings. */
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  taxAmount: string;
  shippingCost: string;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  created_at: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
}

export interface OrderTracking {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string | null;
  estimatedDelivery: string | null;
  currentLocation: string | null;
  trackingStatus:
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed_attempt"
    | "returned"
    | null;
}

export interface OrderNote {
  id: string;
  content: string;
  noteType: "customer_note" | "vendor_note" | "admin_note" | string;
  created_at: string;
  user?: { firstName: string; lastName: string };
}

/** What the order detail returns: the list fields plus where, tracking and notes. */
export interface OrderDetail extends Order {
  shippingAddress: Address;
  tracking: OrderTracking | null;
  orderNotes: OrderNote[];
}
