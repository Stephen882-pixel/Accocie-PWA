import type { Product, ProductVariant } from "@/features/catalog/types/catalog";

export interface CartItem {
  id: string;
  quantity: number;
  /** The unit price when added; `currentPrice` is today's. */
  priceAtAddition: string;
  currentPrice: string;
  availableStock: number;
  priceChanged: boolean;
  /** e.g. "Insufficient stock", "Price changed from 100 to 120". */
  issues: string[];
  product: Pick<
    Product,
    "id" | "name" | "price" | "status" | "images" | "vendor"
  >;
  variant: Pick<ProductVariant, "id" | "name" | "price" | "options"> | null;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  /** Decimal string, e.g. "94997.00". */
  subtotal: string;
  /** Total units, not lines. */
  itemCount: number;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}
