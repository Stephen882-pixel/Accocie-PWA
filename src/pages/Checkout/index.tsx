import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import QueryError from "@/components/feedback/QueryError";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import { toApiError } from "@/lib/api/apiError";
import { formatPrice } from "@/lib/utils/format";
import AddressForm from "@/features/addresses/components/AddressForm";
import AddressText from "@/features/addresses/components/AddressText";
import { useAddresses } from "@/features/addresses/queries/addresses";
import OrderTotals from "@/features/checkout/components/OrderTotals";
import {
  useCheckoutSummary,
  usePlaceOrder,
} from "@/features/checkout/queries/checkout";

const Skeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-3">
    <div className="h-28 animate-pulse rounded-card bg-grey-100" />
    <div className="h-28 animate-pulse rounded-card bg-grey-100" />
  </div>
);

/** Two steps on one screen: choose where to deliver, then review and pay. */
const Checkout = () => {
  const navigate = useNavigate();
  const summary = useCheckoutSummary();
  const addresses = useAddresses();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState<"delivery" | "review">("delivery");
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [notes, setNotes] = useState("");

  const list = addresses.data ?? [];
  // Until the user picks, preselect the default (or only) address.
  const selected =
    list.find((a) => a.id === chosenId) ??
    list.find((a) => a.isDefault) ??
    list[0];

  const data = summary.data;
  const summaryError = summary.error ? toApiError(summary.error) : null;
  if (summaryError?.message === "Cart is empty") {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = () => {
    if (!selected) return;
    placeOrder.mutate(
      {
        shippingAddressId: selected.id,
        paymentMethod: "cash_on_delivery",
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (order) =>
          navigate("/order-placed", { replace: true, state: { order } }),
      },
    );
  };

  const orderError = placeOrder.error ? toApiError(placeOrder.error) : null;
  const stockProblems = Array.isArray(orderError?.details)
    ? (orderError.details as string[])
    : [];

  return (
    <AuthShell
      backTo="/cart"
      title="Checkout"
      subtitle={
        step === "delivery"
          ? "Step 1 of 2 · Where should we deliver?"
          : "Step 2 of 2 · Review and pay"
      }
    >
      {summaryError || addresses.isError ? (
        <QueryError
          message={(summaryError ?? toApiError(addresses.error)).message}
          onRetry={() => {
            summary.refetch();
            addresses.refetch();
          }}
        />
      ) : !data || addresses.isPending ? (
        <Skeleton />
      ) : step === "delivery" ? (
        <>
          {list.length === 0 || isAddingAddress ? (
            <section className="rounded-card border border-grey-300 p-4">
              <h2 className="mb-4 text-base font-semibold">
                {list.length === 0
                  ? "Add a delivery address"
                  : "New delivery address"}
              </h2>
              <AddressForm
                onSaved={(address) => {
                  setChosenId(address.id);
                  setIsAddingAddress(false);
                }}
                onCancel={
                  list.length ? () => setIsAddingAddress(false) : undefined
                }
              />
            </section>
          ) : (
            <>
              <fieldset className="flex flex-col gap-3">
                <legend className="sr-only">Delivery address</legend>
                {list.map((address) => (
                  <label
                    key={address.id}
                    className={`flex gap-3 rounded-card p-4 ${
                      address.id === selected?.id
                        ? "border-2 border-primary bg-primary-light"
                        : "border border-grey-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={address.id === selected?.id}
                      onChange={() => setChosenId(address.id)}
                      className="mt-0.5 size-5 shrink-0 accent-primary"
                    />
                    <AddressText address={address} />
                  </label>
                ))}
              </fieldset>
              <Button variant="ghost" onClick={() => setIsAddingAddress(true)}>
                + Add a new address
              </Button>
              <Button disabled={!selected} onClick={() => setStep("review")}>
                Continue to review
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          {selected ? (
            <section className="flex items-start justify-between gap-3 rounded-card border border-grey-300 p-4">
              <AddressText address={selected} />
              <button
                type="button"
                onClick={() => setStep("delivery")}
                className="-my-3 min-h-11 shrink-0 text-sm font-semibold text-primary"
              >
                Change
              </button>
            </section>
          ) : null}

          <section className="flex flex-col gap-2 text-sm">
            <h2 className="text-base font-semibold">Items</h2>
            {data.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex justify-between gap-3"
              >
                <span>
                  {item.variantName ?? item.productName} × {item.quantity}
                </span>
                <span className="shrink-0">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </span>
              </div>
            ))}
          </section>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-base font-semibold">Payment</legend>
            <label className="flex min-h-13 items-center gap-3 rounded-control border-2 border-primary bg-primary-light px-4 text-sm font-semibold">
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className="size-5 accent-primary"
              />
              Cash on delivery
            </label>
            {["M-Pesa", "Card"].map((method) => (
              <label
                key={method}
                className="flex min-h-13 items-center gap-3 rounded-control border border-grey-300 px-4 text-sm text-grey-700"
              >
                <input
                  type="radio"
                  name="payment"
                  disabled
                  className="size-5"
                />
                {method}
                <span className="ml-auto text-xs">Coming soon</span>
              </label>
            ))}
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes" className="text-sm font-medium">
              Note for the delivery (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              maxLength={1000}
              rows={2}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Call when you reach the gate"
              className="rounded-control border border-grey-400 px-3.5 py-3 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <section className="border-t border-grey-300 pt-4">
            <OrderTotals {...data} />
          </section>

          {orderError ? (
            <Alert tone="error">
              {stockProblems.length ? (
                <>
                  Some items changed since you started checkout:
                  <ul className="mt-1 list-disc pl-5">
                    {stockProblems.map((problem) => (
                      <li key={problem}>{problem}</li>
                    ))}
                  </ul>
                  <Link
                    to="/cart"
                    className="mt-2 inline-block font-semibold underline"
                  >
                    Update your cart
                  </Link>
                </>
              ) : (
                orderError.message
              )}
            </Alert>
          ) : null}

          <Button onClick={handlePlaceOrder} isLoading={placeOrder.isPending}>
            Place order · {formatPrice(data.totalAmount)}
          </Button>
        </>
      )}
    </AuthShell>
  );
};

export default Checkout;
