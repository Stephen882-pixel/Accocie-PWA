import type { Order, OrderStatus } from "@/features/orders/types/order";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Being packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/** Badge colours: blue while moving, green when done, grey when stopped. */
export const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-warning-50 text-warning-700",
  confirmed: "bg-info-50 text-info-700",
  processing: "bg-info-50 text-info-700",
  shipped: "bg-info-50 text-info-700",
  delivered: "bg-success-50 text-success-700",
  cancelled: "bg-grey-100 text-grey-700",
  refunded: "bg-grey-100 text-grey-700",
};

/** One line under each order in the list: what the customer is waiting for. */
export const STATUS_HINT: Record<OrderStatus, string> = {
  pending: "Waiting for Acocie to confirm",
  confirmed: "Waiting for the seller to accept",
  processing: "The seller is packing it",
  shipped: "On its way to you",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const isInProgress = (status: OrderStatus) =>
  ["pending", "confirmed", "processing", "shipped"].includes(status);

/** The customer may ask to cancel only before the seller accepts (API rule). */
export const canRequestCancellation = (status: OrderStatus) =>
  status === "pending" || status === "confirmed";

const RETURN_WINDOW_DAYS = 14;

/** Returns: delivered, within 14 days of delivery (API rule). */
export const canRequestReturn = (order: Order) =>
  order.status === "delivered" &&
  !!order.deliveredAt &&
  Date.now() - new Date(order.deliveredAt).getTime() <
    RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export interface TimelineStep {
  label: string;
  /** When it happened, if the API recorded it. */
  at: string | null;
  state: "done" | "current" | "upcoming";
}

const FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

/** The five steps every order goes through, marked against its status. */
export const getTimeline = (order: Order): TimelineStep[] => {
  const reached = FLOW.indexOf(order.status);
  const steps: { label: string; at: string | null }[] = [
    { label: "Order placed", at: order.created_at },
    { label: "Confirmed by Acocie", at: order.confirmedAt },
    { label: "Accepted by the seller", at: null },
    { label: "Shipped", at: order.shippedAt },
    { label: "Delivered", at: order.deliveredAt },
  ];

  return steps.map((step, index) => ({
    ...step,
    state:
      index < reached || order.status === "delivered"
        ? "done"
        : index === reached
          ? "current"
          : "upcoming",
  }));
};
