import ProductCard from "@/features/catalog/components/ProductCard";
import { useFeaturedProducts } from "@/features/catalog/queries/catalog";

/** A sideways row of featured products. Extra, so it simply hides on failure. */
const FeaturedRow = () => {
  const { data: products } = useFeaturedProducts();

  if (!products?.length) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Featured</h2>
      <div className="-mx-(--shell-gutter) flex gap-3 overflow-x-auto px-(--shell-gutter) pb-1 [scrollbar-width:none]">
        {products.map((product) => (
          <div key={product.id} className="w-40 shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRow;
