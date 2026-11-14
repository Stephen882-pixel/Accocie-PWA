import type { Pagination } from "@/types/api";

// Money arrives as decimal strings ("89999.00"), as the API sends them.

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  displayOrder: number;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  /** e.g. `{ storage: "128GB", color: "Phantom Black" }` */
  options: Record<string, string>;
  /** Overrides the product price when set. */
  price: string | null;
  comparePrice: string | null;
  stockQuantity: number;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  comparePrice: string | null;
  status: "active" | "out_of_stock" | "inactive" | "draft";
  stockQuantity: number;
  category?: { id: string; name: string; slug: string };
  vendor?: { id: string; firstName: string; lastName: string };
  /** The list endpoints include the primary image only. */
  images: ProductImage[];
  /** Detail only. Active variants. */
  variants?: ProductVariant[];
  /** Detail only. */
  inventory?: { availableStock: number } | null;
}

export interface ProductPage {
  products: Product[];
  pagination: Pagination;
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "popular";

export interface ProductFilters {
  q?: string;
  category?: string;
  sort: ProductSort;
}
