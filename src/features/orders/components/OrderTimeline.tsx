import { Check } from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import { getTimeline } from "@/features/orders/utils/status";
import type { Order } from "@/features/orders/types/order";

/** The order's progress, top to bottom, with times where the API has them. */
const OrderTimeline = ({ order }: { order: Order }) => {
  const steps = getTimeline(order);

  return (
    <ol aria-label="Order progress" className="flex flex-col">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li
            key={step.label}
            aria-current={step.state === "current" ? "step" : undefined}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center">
              {step.state === "done" ? (
                <span className="flex size-[22px] items-center justify-center rounded-full bg-success-700 text-white">
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                </span>
              ) : (
                <span
                  className={`size-[22px] rounded-full bg-background ${
                    step.state === "current"
                      ? "border-[6px] border-info-700"
                      : "border-2 border-grey-400"
                  }`}
                />
              )}
              {isLast ? null : (
                <span
                  className={`min-h-5 w-0.5 flex-1 ${
                    step.state === "done" ? "bg-success-700" : "bg-grey-300"
                  }`}
                />
              )}
            </div>
            <div className={`text-sm leading-5 ${isLast ? "" : "pb-4"}`}>
              <b
                className={
                  step.state === "current"
                    ? "text-info-700"
                    : step.state === "upcoming"
                      ? "text-grey-700"
                      : ""
                }
              >
                {step.label}
              </b>
              {step.at && step.state !== "upcoming" ? (
                <span className="block text-grey-700">
                  {formatDateTime(step.at)}
                </span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderTimeline;
