import { Link } from "react-router";
import PriceTag from "@/features/catalog/components/PriceTag";
import type { Product } from "@/features/catalog/types/catalog";

const ProductCard = ({ product }: { product: Product }) => {
  const image = product.images[0];
  const isOutOfStock =
    product.status === "out_of_stock" || product.stockQuantity <= 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex min-w-0 flex-col gap-2"
    >
      <div className="relative aspect-square overflow-hidden rounded-card bg-grey-100">
        {image ? (
          <img
            src={image.imageUrl}
            alt={image.altText ?? product.name}
            loading="lazy"
            className="size-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : null}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-grey-700">
            Out of stock
          </span>
        ) : null}
      </div>
      <span className="line-clamp-2 text-sm leading-5 font-medium">
        {product.name}
      </span>
      {product.vendor ? (
        <span className="-mt-1 truncate text-xs text-grey-700">
          {product.vendor.firstName} {product.vendor.lastName}
        </span>
      ) : null}
      <PriceTag price={product.price} comparePrice={product.comparePrice} />
    </Link>
  );
};

export default ProductCard;
