import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import QueryError from "@/components/feedback/QueryError";
import Button from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonStyles";
import { toApiError } from "@/lib/api/apiError";
import { useIsSignedIn } from "@/lib/auth/authStore";
import { formatPrice } from "@/lib/utils/format";
import CartLine from "@/features/cart/components/CartLine";
import { useCart } from "@/features/cart/queries/cart";

const EmptyCart = () => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <div className="flex size-16 items-center justify-center rounded-full bg-grey-100 text-grey-700">
      <ShoppingCart size={28} aria-hidden="true" />
    </div>
    <p className="text-[15px] text-grey-700">Your cart is empty.</p>
    <Link to="/" className={`${buttonClass("secondary")} max-w-60`}>
      Browse products
    </Link>
  </div>
);

const Cart = () => {
  const cart = useCart();
  const isSignedIn = useIsSignedIn();

  const heading = (
    <h1 className="text-xl font-bold">
      Cart
      {cart.data?.itemCount ? (
        <span className="font-normal text-grey-700">
          {" "}
          ({cart.data.itemCount} {cart.data.itemCount === 1 ? "item" : "items"})
        </span>
      ) : null}
    </h1>
  );

  if (cart.isPending) {
    return (
      <div className="flex flex-col gap-3 py-4" aria-hidden="true">
        {heading}
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-card bg-grey-100"
          />
        ))}
      </div>
    );
  }

  if (cart.isError) {
    return (
      <div className="flex flex-col gap-4 py-4">
        {heading}
        <QueryError
          message={toApiError(cart.error).message}
          onRetry={() => cart.refetch()}
        />
      </div>
    );
  }

  const { items, subtotal } = cart.data;
  if (items.length === 0) {
    return (
      <div className="py-4">
        {heading}
        <EmptyCart />
      </div>
    );
  }

  const hasIssues = items.some((item) => item.issues.length > 0);

  return (
    <div className="flex flex-col gap-3 py-4">
      {heading}
      {items.map((item) => (
        <CartLine key={item.id} item={item} />
      ))}

      <section
        aria-label="Cart total"
        className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] -mx-(--shell-gutter) mt-2 flex flex-col gap-3 border-t border-grey-300 bg-background px-(--shell-gutter) py-3"
      >
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] text-grey-700">Subtotal</span>
          <span className="text-xl font-bold">{formatPrice(subtotal)}</span>
        </div>
        <p className="-mt-2 text-xs text-grey-700">
          {hasIssues
            ? "Fix the items marked above before checking out."
            : "VAT and delivery are added at checkout."}
        </p>
        {!isSignedIn ? (
          <Link to="/login" state={{ from: "/cart" }} className={buttonClass()}>
            Sign in to check out
          </Link>
        ) : hasIssues ? (
          <Button disabled>Proceed to checkout</Button>
        ) : (
          <Link to="/checkout" className={buttonClass()}>
            Proceed to checkout
          </Link>
        )}
      </section>
    </div>
  );
};

export default Cart;
