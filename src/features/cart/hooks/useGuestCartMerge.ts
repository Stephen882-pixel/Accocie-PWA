import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useIsSignedIn } from "@/lib/auth/authStore";
import { CartService } from "@/features/cart/api/cartService";
import {
  clearCartSessionId,
  getCartSessionId,
} from "@/features/cart/utils/cartSession";

// Module-level so a double-run effect (StrictMode) cannot merge twice and
// double the quantities.
let merging = false;

/**
 * Once signed in, folds the cart the user built as a guest into their
 * account. If the merge fails the guest id is kept, so the next visit retries
 * and nothing is lost.
 */
export const useGuestCartMerge = () => {
  const isSignedIn = useIsSignedIn();
  const queryClient = useQueryClient();

  useEffect(() => {
    const sessionId = getCartSessionId();
    if (!isSignedIn || !sessionId || merging) return;

    merging = true;
    CartService.merge(sessionId)
      .then(() => {
        clearCartSessionId();
        return queryClient.invalidateQueries({ queryKey: ["cart"] });
      })
      .catch(() => {})
      .finally(() => {
        merging = false;
      });
  }, [isSignedIn, queryClient]);
};
