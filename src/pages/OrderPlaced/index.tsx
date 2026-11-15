import { Link, Navigate, useLocation } from "react-router";
import { Check } from "lucide-react";
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
  const order = (useLocation().state as { order?: PlacedOrder } | null)?.order;

  // Only reachable straight after checkout; a refresh or old link goes home.
  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-6 bg-background px-(--shell-gutter) pt-12 pb-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-success-50 text-success-700">
          <Check size={40} strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h1 className="text-[26px] leading-[34px] font-bold">Order placed</h1>
        <p className="text-[15px] leading-[22px] text-grey-700">
          Order <b className="text-ink">{order.orderNumber}</b>. Pay{" "}
          <b className="text-ink">{formatPrice(order.totalAmount)}</b> in cash
          when it arrives. A confirmation is on its way to your email.
        </p>
      </div>

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
