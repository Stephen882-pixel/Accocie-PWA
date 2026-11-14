import ProductCard from "@/features/catalog/components/ProductCard";
import type { Product } from "@/features/catalog/types/catalog";

// The skeleton shares this grid, so nothing shifts when products arrive.
const GRID = "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3";

export const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className={GRID}>
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className={GRID} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="flex flex-col gap-2">
        <div className="aspect-square animate-pulse rounded-card bg-grey-100" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-grey-100" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-grey-100" />
      </div>
    ))}
  </div>
);
