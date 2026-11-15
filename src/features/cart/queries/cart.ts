import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "@/lib/auth/authStore";
import { CartService } from "@/features/cart/api/cartService";
import type { AddToCartPayload } from "@/features/cart/types/cart";

// Keyed by who is shopping, so signing in or out never shows the other cart.
const cartKey = (userId?: string) => ["cart", userId ?? "guest"];

export const useCart = () => {
  const user = useAuthUser();
  return useQuery({
    queryKey: cartKey(user?.id),
    queryFn: CartService.getCart,
  });
};

/** After any change, refetch the cart: the API owns totals and stock checks. */
const useCartMutation = <T>(mutationFn: (variables: T) => Promise<void>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useAddToCart = () =>
  useCartMutation((payload: AddToCartPayload) => CartService.addItem(payload));

export const useUpdateCartItem = () =>
  useCartMutation(
    ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      CartService.updateItem(itemId, quantity),
  );

export const useRemoveCartItem = () =>
  useCartMutation((itemId: string) => CartService.removeItem(itemId));
