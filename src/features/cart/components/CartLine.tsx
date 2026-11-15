import { Link } from "react-router";
import { Trash2 } from "lucide-react";
import QuantityStepper from "@/components/ui/QuantityStepper";
import { toApiError } from "@/lib/api/apiError";
import { formatPrice } from "@/lib/utils/format";
import {
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/cart/queries/cart";
import type { CartItem } from "@/features/cart/types/cart";

// The API caps a line at 100.
const MAX_LINE_QUANTITY = 100;

const CartLine = ({ item }: { item: CartItem }) => {
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const image = item.product.images[0];
  const isBusy = update.isPending || remove.isPending;
  const error = update.error ?? remove.error;

  return (
    <article className="flex gap-3 rounded-card border border-grey-300 p-3">
      <Link
        to={`/products/${item.product.id}`}
        className="size-20 shrink-0 overflow-hidden rounded-control bg-grey-100"
      >
        {image ? (
          <img
            src={image.imageUrl}
            alt={image.altText ?? item.product.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${item.product.id}`}
            className="line-clamp-2 text-sm leading-5 font-semibold"
          >
            {item.product.name}
          </Link>
          <button
            type="button"
            aria-label={`Remove ${item.product.name}`}
            disabled={isBusy}
            onClick={() => remove.mutate(item.id)}
            className="-mt-2.5 -mr-2.5 flex size-11 shrink-0 items-center justify-center text-grey-700"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="truncate text-xs text-grey-700">
          {[item.variant?.name, item.product.vendor?.firstName]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {item.issues.map((issue) => (
          <p key={issue} className="text-xs font-medium text-error-700">
            {issue}
          </p>
        ))}
        {error ? (
          <p role="alert" className="text-xs font-medium text-error-700">
            {toApiError(error).message}
          </p>
        ) : null}

        <div className="mt-1 flex items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={Math.min(item.availableStock, MAX_LINE_QUANTITY)}
            disabled={isBusy}
            onChange={(quantity) =>
              update.mutate({ itemId: item.id, quantity })
            }
          />
          <span className="text-[15px] font-bold">
            {formatPrice(Number(item.currentPrice) * item.quantity)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CartLine;
