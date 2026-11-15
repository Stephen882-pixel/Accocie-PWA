import { api } from "@/lib/api/client";
import { authStore } from "@/lib/auth/authStore";
import type { ApiSuccess } from "@/types/api";
import {
  getCartSessionId,
  getOrCreateCartSessionId,
} from "@/features/cart/utils/cartSession";
import type { AddToCartPayload, Cart } from "@/features/cart/types/cart";

export const EMPTY_CART: Cart = {
  id: null,
  items: [],
  subtotal: "0.00",
  itemCount: 0,
};

const isGuest = () => authStore.getState().accessToken === null;

/** A guest's requests carry the cart id; a signed-in user's cart comes from the token. */
const sessionHeaders = (sessionId: string | null) =>
  isGuest() && sessionId ? { headers: { "X-Session-ID": sessionId } } : {};

export const CartService = {
  getCart: async (): Promise<Cart> => {
    const sessionId = getCartSessionId();
    // A guest who never added anything has no cart, and the API would 400.
    if (isGuest() && !sessionId) return EMPTY_CART;

    const response = await api.get<ApiSuccess<Cart>>(
      "/cart",
      sessionHeaders(sessionId),
    );
    return response.data.data;
  },

  addItem: async (payload: AddToCartPayload) => {
    // The first add is what gives a guest a cart.
    const sessionId = isGuest() ? getOrCreateCartSessionId() : null;
    await api.post("/cart/items", payload, sessionHeaders(sessionId));
  },

  updateItem: async (itemId: string, quantity: number) => {
    await api.put(
      `/cart/items/${itemId}`,
      { quantity },
      sessionHeaders(getCartSessionId()),
    );
  },

  removeItem: async (itemId: string) => {
    await api.delete(
      `/cart/items/${itemId}`,
      sessionHeaders(getCartSessionId()),
    );
  },

  /** Moves a guest cart into the signed-in user's cart. */
  merge: async (sessionId: string) => {
    await api.post("/cart/merge", { sessionId });
  },
};
