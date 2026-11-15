import { useState } from "react";
import { Link } from "react-router";
import { Package } from "lucide-react";
import QueryError from "@/components/feedback/QueryError";
import Button from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonStyles";
import { toApiError } from "@/lib/api/apiError";
import { useIsSignedIn } from "@/lib/auth/authStore";
import OrderCard from "@/features/orders/components/OrderCard";
import { useOrders } from "@/features/orders/queries/orders";
import { isInProgress } from "@/features/orders/utils/status";
import type { Order } from "@/features/orders/types/order";

const FILTERS = {
  all: { label: "All", matches: () => true },
  active: {
    label: "In progress",
    matches: (o: Order) => isInProgress(o.status),
  },
  delivered: {
    label: "Delivered",
    matches: (o: Order) => o.status === "delivered",
  },
  cancelled: {
    label: "Cancelled",
    matches: (o: Order) => o.status === "cancelled" || o.status === "refunded",
  },
} as const;

type Filter = keyof typeof FILTERS;

const Message = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <div className="flex size-16 items-center justify-center rounded-full bg-grey-100 text-grey-700">
      <Package size={28} aria-hidden="true" />
    </div>
    {children}
  </div>
);

const OrderList = () => {
  const orders = useOrders();
  const [filter, setFilter] = useState<Filter>("all");

  if (orders.isPending) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-card bg-grey-100"
          />
        ))}
      </div>
    );
  }

  if (orders.isError) {
    return (
      <QueryError
        message={toApiError(orders.error).message}
        onRetry={() => orders.refetch()}
      />
    );
  }

  const all = orders.data.pages.flatMap((page) => page.orders);
  if (all.length === 0) {
    return (
      <Message>
        <p className="text-[15px] text-grey-700">No orders yet.</p>
        <Link to="/" className={`${buttonClass("secondary")} max-w-60`}>
          Start shopping
        </Link>
      </Message>
    );
  }

  // Filtering is done here, over the orders loaded so far.
  const shown = all.filter(FILTERS[filter].matches);

  return (
    <>
      <div
        role="group"
        aria-label="Filter orders"
        className="-mx-(--shell-gutter) flex gap-2 overflow-x-auto px-(--shell-gutter) [scrollbar-width:none]"
      >
        {(Object.keys(FILTERS) as Filter[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={`h-10 shrink-0 rounded-full border px-4 text-sm ${
              filter === key
                ? "border-primary bg-primary-light font-semibold text-primary-dark"
                : "border-grey-300 font-medium text-grey-700"
            }`}
          >
            {FILTERS[key].label}
          </button>
        ))}
      </div>

      {shown.length ? (
        shown.map((order) => <OrderCard key={order.id} order={order} />)
      ) : (
        <p className="py-8 text-center text-[15px] text-grey-700">
          No {FILTERS[filter].label.toLowerCase()} orders.
        </p>
      )}

      {orders.hasNextPage ? (
        <Button
          variant="secondary"
          onClick={() => orders.fetchNextPage()}
          isLoading={orders.isFetchingNextPage}
        >
          Show older orders
        </Button>
      ) : null}
    </>
  );
};

const Orders = () => {
  const isSignedIn = useIsSignedIn();

  return (
    <div className="flex flex-col gap-3 py-4">
      <h1 className="text-xl font-bold">My orders</h1>
      {isSignedIn ? (
        <OrderList />
      ) : (
        <Message>
          <p className="text-[15px] text-grey-700">
            Sign in to see and track your orders.
          </p>
          <Link
            to="/login"
            state={{ from: "/orders" }}
            className={`${buttonClass()} max-w-60`}
          >
            Sign in
          </Link>
        </Message>
      )}
    </div>
  );
};

export default Orders;
