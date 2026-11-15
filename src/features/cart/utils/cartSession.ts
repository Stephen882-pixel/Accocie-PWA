// A guest's cart is keyed by an id this app generates and sends as
// `X-Session-ID`. After sign-in it is merged into the account and dropped.

const CART_SESSION_KEY = "acocie-pwa-cart-session";

export const getCartSessionId = (): string | null => {
  try {
    return localStorage.getItem(CART_SESSION_KEY);
  } catch {
    return null;
  }
};

export const getOrCreateCartSessionId = (): string => {
  const existing = getCartSessionId();
  if (existing) return existing;

  const id = crypto.randomUUID();
  try {
    localStorage.setItem(CART_SESSION_KEY, id);
  } catch {
    // Storage blocked: the cart lasts for this page load only.
  }
  return id;
};

export const clearCartSessionId = () => {
  try {
    localStorage.removeItem(CART_SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
};
