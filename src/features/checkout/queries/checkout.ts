import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckoutService } from "@/features/checkout/api/checkoutService";
import type { PlaceOrderPayload } from "@/features/checkout/types/checkout";

export const useCheckoutSummary = () =>
  useQuery({
    queryKey: ["checkout", "summary"],
    queryFn: CheckoutService.getSummary,
    // Always price from the cart as it is now, never from a cached copy.
    staleTime: 0,
    gcTime: 0,
  });

/** Placing an order empties the cart and changes stock, so refetch both. */
export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) =>
      CheckoutService.placeOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
