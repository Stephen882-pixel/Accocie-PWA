import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import QueryError from "@/components/feedback/QueryError";
import Button from "@/components/ui/Button";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { buttonClass } from "@/components/ui/buttonStyles";
import { toApiError } from "@/lib/api/apiError";
import PriceTag from "@/features/catalog/components/PriceTag";
import ProductGallery from "@/features/catalog/components/ProductGallery";
import VariantPicker from "@/features/catalog/components/VariantPicker";
import { productQuery } from "@/features/catalog/queries/catalog";
import { useAddToCart } from "@/features/cart/queries/cart";
import type { Product } from "@/features/catalog/types/catalog";
import {
  findVariant,
  getOptionGroups,
} from "@/features/catalog/utils/variants";

const MAX_QUANTITY = 10;

const stockLabel = (stock: number) => {
  if (stock <= 0) return { text: "Out of stock", tone: "text-grey-700" };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: "text-error-700" };
  return { text: "In stock", tone: "text-success-700" };
};

const ProductView = ({ product }: { product: Product }) => {
  const variants = product.variants ?? [];
  const groups = getOptionGroups(variants);
  const [selected, setSelected] = useState<Record<string, string>>(
    () => variants[0]?.options ?? {},
  );
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const variant = variants.length ? findVariant(variants, selected) : undefined;
  const isUnavailable = variants.length > 0 && !variant;

  const price = variant?.price ?? product.price;
  const comparePrice = variants.length
    ? (variant?.comparePrice ?? null)
    : product.comparePrice;
  const stock =
    product.status === "out_of_stock" || isUnavailable
      ? 0
      : variant
        ? variant.stockQuantity
        : (product.inventory?.availableStock ?? product.stockQuantity);

  const maxQuantity = Math.max(1, Math.min(stock, MAX_QUANTITY));
  const shownQuantity = Math.min(quantity, maxQuantity);
  const stockInfo = isUnavailable
    ? { text: "Not available in this combination", tone: "text-grey-700" }
    : stockLabel(stock);

  return (
    <>
      <ProductGallery images={product.images} name={product.name} />

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium tracking-wide text-grey-700 uppercase">
          {product.category?.name}
          {product.vendor
            ? ` · Sold by ${product.vendor.firstName} ${product.vendor.lastName}`
            : null}
        </p>
        <h1 className="text-[22px] leading-[30px] font-bold">{product.name}</h1>
        <PriceTag price={price} comparePrice={comparePrice} size="lg" />
        <p className={`text-sm font-semibold ${stockInfo.tone}`}>
          {stockInfo.text}
        </p>
      </div>

      {groups.length ? (
        <VariantPicker
          groups={groups}
          selected={selected}
          onChange={(name, value) => {
            addToCart.reset();
            setSelected((current) => ({ ...current, [name]: value }));
          }}
        />
      ) : null}

      {product.description ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold">About this product</h2>
          <p className="text-[15px] leading-6 whitespace-pre-line text-grey-700">
            {product.description}
          </p>
        </section>
      ) : null}

      <div className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] -mx-(--shell-gutter) mt-auto flex flex-col gap-2 border-t border-grey-300 bg-background px-(--shell-gutter) py-3">
        {addToCart.isSuccess ? (
          <p role="status" className="text-sm text-success-700">
            Added to your cart.{" "}
            <Link to="/cart" className="font-semibold underline">
              View cart
            </Link>
          </p>
        ) : null}
        {addToCart.error ? (
          <p role="alert" className="text-sm text-error-700">
            {toApiError(addToCart.error).message}
          </p>
        ) : null}
        <div className="flex items-center gap-3">
          <QuantityStepper
            value={shownQuantity}
            max={maxQuantity}
            onChange={(value) => {
              addToCart.reset();
              setQuantity(value);
            }}
          />
          <Button
            disabled={stock <= 0}
            isLoading={addToCart.isPending}
            onClick={() =>
              addToCart.mutate({
                productId: product.id,
                variantId: variant?.id,
                quantity: shownQuantity,
              })
            }
          >
            {stock <= 0 ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </>
  );
};

const ProductDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = useQuery(productQuery(id));

  // Opened from a link with no app history to return to: go home instead.
  const goBack = () =>
    location.key === "default" ? navigate("/") : navigate(-1);

  const error = product.error ? toApiError(product.error) : null;

  return (
    <div className="flex min-h-[calc(100svh-var(--nav-h)-var(--tabbar-h))] flex-col gap-5 pt-2">
      <button
        type="button"
        onClick={goBack}
        className="-ml-3 flex size-11 items-center justify-center"
        aria-label="Back"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>

      {product.isPending ? (
        <div aria-hidden="true" className="flex flex-col gap-4">
          <div className="aspect-square animate-pulse rounded-card bg-grey-100" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-grey-100" />
          <div className="h-7 w-1/3 animate-pulse rounded bg-grey-100" />
        </div>
      ) : error?.status === 404 ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-[15px] text-grey-700">
            This product is no longer available.
          </p>
          <Link to="/" className={`${buttonClass("secondary")} max-w-60`}>
            Back to the marketplace
          </Link>
        </div>
      ) : error ? (
        <QueryError message={error.message} onRetry={() => product.refetch()} />
      ) : product.data ? (
        <ProductView key={product.data.id} product={product.data} />
      ) : null}
    </div>
  );
};

export default ProductDetail;
