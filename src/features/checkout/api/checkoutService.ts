import { api } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/api";
import type {
  CheckoutSummary,
  PlaceOrderPayload,
  PlacedOrder,
} from "@/features/checkout/types/checkout";

export const CheckoutService = {
  /** The signed-in user's cart, priced: VAT and delivery included. */
  getSummary: async (): Promise<CheckoutSummary> => {
    const response =
      await api.get<ApiSuccess<CheckoutSummary>>("/checkout/summary");
    return response.data.data;
  },

  // One order per seller. The API checks stock again and deducts it as it
  // creates them, all or nothing.
  placeOrder: async (payload: PlaceOrderPayload): Promise<PlacedOrder[]> => {
    const response = await api.post<ApiSuccess<{ orders: PlacedOrder[] }>>(
      "/checkout/place-order",
      payload,
    );
    return response.data.data.orders;
  },
};
