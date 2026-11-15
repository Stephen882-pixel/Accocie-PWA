import { Link, Navigate, useLocation } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { buttonClass } from "@/components/ui/buttonStyles";
import { formatPrice } from "@/lib/utils/format";
import type { PlacedOrder } from "@/features/checkout/types/checkout";

// What happens to every order after it is placed, as the backend runs it.
const NEXT_STEPS = [
  { title: "Acocie confirms your order", status: "Pending → Confirmed" },
  { title: "The seller accepts and packs it", status: "Processing" },
  { title: "It ships with a tracking number", status: "Shipped" },
  { title: "You receive it and pay the courier", status: "Delivered" },
];

const OrderPlaced = () => {
  const orders = (useLocation().state as { orders?: PlacedOrder[] } | null)
    ?.orders;

  // Only reachable straight after checkout; a refresh or old link goes home.
  if (!orders?.length) return <Navigate to="/" replace />;

  const total = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const isSplit = orders.length > 1;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 bg-background px-(--shell-gutter) pt-12 pb-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-success-50 text-success-700">
          <Check size={40} strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h1 className="text-[26px] leading-[34px] font-bold">
          {isSplit ? `${orders.length} orders placed` : "Order placed"}
        </h1>
        <p className="text-[15px] leading-[22px] text-grey-700">
          {isSplit
            ? "Your items come from different sellers, so each one delivers its own order. "
            : null}
          Pay <b className="text-ink">{formatPrice(total)}</b> in cash on
          delivery. A confirmation is on its way to your email.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              to={`/orders/${order.id}`}
              className="flex min-h-14 items-center gap-3 rounded-card border border-grey-300 px-4"
            >
              <span className="flex-1 font-mono text-sm font-semibold">
                {order.orderNumber}
              </span>
              <span className="text-sm font-bold">
                {formatPrice(order.totalAmount)}
              </span>
              <ChevronRight
                size={18}
                aria-hidden="true"
                className="text-grey-700"
              />
            </Link>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-3.5 rounded-card border border-grey-300 p-5">
        <h2 className="text-xs font-semibold tracking-wide text-grey-700 uppercase">
          What happens next
        </h2>
        <ol className="flex flex-col gap-3.5 text-sm leading-5">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0 ? "bg-primary text-white" : "bg-grey-100"
                }`}
              >
                {index + 1}
              </span>
              <span>
                <b>{step.title}</b>
                <br />
                <span className="text-grey-700">{step.status}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-[13px] text-grey-700">
          You can cancel until the seller accepts the order.
        </p>
      </section>

      <Link to="/" replace className={`${buttonClass()} mt-auto`}>
        Keep shopping
      </Link>
    </div>
  );
};

export default OrderPlaced;
