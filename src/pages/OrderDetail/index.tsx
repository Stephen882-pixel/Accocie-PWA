import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Truck } from "lucide-react";
import Alert from "@/components/feedback/Alert";
import QueryError from "@/components/feedback/QueryError";
import { toApiError } from "@/lib/api/apiError";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils/format";
import AddressText from "@/features/addresses/components/AddressText";
import OrderTotals from "@/features/checkout/components/OrderTotals";
import OrderRequestForm from "@/features/orders/components/OrderRequestForm";
import OrderStatusBadge from "@/features/orders/components/OrderStatusBadge";
import OrderTimeline from "@/features/orders/components/OrderTimeline";
import {
  useAddOrderNote,
  useOrder,
  useRequestCancellation,
  useRequestReturn,
} from "@/features/orders/queries/orders";
import {
  canRequestCancellation,
  canRequestReturn,
} from "@/features/orders/utils/status";
import type { OrderDetail as Order } from "@/features/orders/types/order";

const TRACKING_STATUS: Record<string, string> = {
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  failed_attempt: "Delivery attempt failed",
  returned: "Returned to sender",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-2.5">
    <h2 className="text-base font-semibold">{title}</h2>
    {children}
  </section>
);

const Notes = ({ order }: { order: Order }) => {
  const addNote = useAddOrderNote(order.id);
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNote.mutate(draft.trim(), { onSuccess: () => setDraft("") });
  };

  return (
    <Section title="Messages">
      {order.orderNotes.length ? (
        <ul className="flex flex-col gap-2">
          {order.orderNotes.map((note) => (
            <li
              key={note.id}
              className={`rounded-card px-3.5 py-2.5 text-sm ${
                note.noteType === "customer_note"
                  ? "ml-8 bg-primary-light"
                  : "mr-8 border border-grey-300"
              }`}
            >
              <p className="whitespace-pre-line">{note.content}</p>
              <p className="mt-1 text-xs text-grey-700">
                {note.noteType === "customer_note"
                  ? "You"
                  : note.noteType === "vendor_note"
                    ? "Seller"
                    : "Acocie"}{" "}
                · {formatDateTime(note.created_at)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-grey-700">
          Questions about this order? Send the seller a message.
        </p>
      )}
      {addNote.error ? (
        <Alert tone="error">{toApiError(addNote.error).message}</Alert>
      ) : null}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="note" className="sr-only">
          Message
        </label>
        <input
          id="note"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={1000}
          placeholder="Write a message"
          className="h-11 min-w-0 flex-1 rounded-full border border-grey-400 px-4 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!draft.trim() || addNote.isPending}
          className="h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {addNote.isPending ? "Sending…" : "Send"}
        </button>
      </form>
    </Section>
  );
};

const OrderView = ({ order }: { order: Order }) => {
  const cancel = useRequestCancellation(order.id);
  const requestReturn = useRequestReturn(order.id);
  const isStopped = order.status === "cancelled" || order.status === "refunded";

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-mono text-lg font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-grey-700">
            Placed {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.tracking && !isStopped ? (
        <section className="flex flex-col gap-1.5 rounded-card bg-info-50 p-4 text-sm">
          <p className="flex items-center gap-2 text-base font-semibold text-info-700">
            <Truck size={20} aria-hidden="true" />
            {order.tracking.estimatedDelivery && order.status !== "delivered"
              ? `Arriving ${formatDate(order.tracking.estimatedDelivery)}`
              : (TRACKING_STATUS[order.tracking.trackingStatus ?? ""] ??
                "On its way")}
          </p>
          <p>
            {order.tracking.carrier} ·{" "}
            <span className="font-mono">{order.tracking.trackingNumber}</span>
          </p>
          {order.tracking.currentLocation ? (
            <p className="text-grey-700">{order.tracking.currentLocation}</p>
          ) : null}
          {order.tracking.trackingUrl ? (
            <a
              href={order.tracking.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="-mb-2 flex min-h-11 items-center self-start font-semibold text-info-700"
            >
              Track with {order.tracking.carrier}
            </a>
          ) : null}
        </section>
      ) : null}

      {isStopped ? (
        <Alert tone="info">
          This order was {order.status}
          {order.cancelledAt ? ` on ${formatDate(order.cancelledAt)}` : ""}.
        </Alert>
      ) : (
        <OrderTimeline order={order} />
      )}

      <p className="flex items-center gap-2 text-xs text-grey-700">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-success-700"
        />
        Updates here as soon as the status changes.
      </p>

      <Section title="Items">
        <ul className="flex flex-col gap-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span>
                <Link
                  to={`/products/${item.productId}`}
                  className="font-medium"
                >
                  {item.variantName ?? item.productName}
                </Link>{" "}
                × {item.quantity}
                {item.vendor ? (
                  <span className="block text-xs text-grey-700">
                    Sold by {item.vendor.firstName} {item.vendor.lastName}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0">{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Delivery address">
        <AddressText address={order.shippingAddress} />
      </Section>

      <Section title="Payment">
        <p className="text-sm text-grey-700">Cash on delivery</p>
        <OrderTotals {...order} />
      </Section>

      <Notes order={order} />

      {canRequestCancellation(order.status) ? (
        <OrderRequestForm
          openLabel="Cancel this order"
          submitLabel="Request cancellation"
          successMessage="Cancellation requested. We will email you once it is approved."
          request={cancel}
        />
      ) : null}
      {canRequestReturn(order) ? (
        <OrderRequestForm
          openLabel="Return items"
          submitLabel="Request a return"
          successMessage="Return requested. We will email you with next steps."
          request={requestReturn}
        />
      ) : null}
      {order.status === "processing" || order.status === "shipped" ? (
        <p className="text-center text-xs text-grey-700">
          Cancelling closed when the seller accepted. You can return items once
          delivered.
        </p>
      ) : null}
    </>
  );
};

const OrderDetail = () => {
  const { id = "" } = useParams();
  const order = useOrder(id);
  const error = order.error ? toApiError(order.error) : null;

  return (
    <div className="flex flex-col gap-5 pt-2 pb-6">
      <Link
        to="/orders"
        aria-label="Back to orders"
        className="-ml-3 flex size-11 items-center justify-center"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </Link>

      {order.isPending ? (
        <div aria-hidden="true" className="flex flex-col gap-4">
          <div className="h-12 animate-pulse rounded bg-grey-100" />
          <div className="h-56 animate-pulse rounded-card bg-grey-100" />
        </div>
      ) : error?.status === 404 ? (
        <p className="py-10 text-center text-[15px] text-grey-700">
          We could not find this order.
        </p>
      ) : error ? (
        <QueryError message={error.message} onRetry={() => order.refetch()} />
      ) : order.data ? (
        <OrderView order={order.data} />
      ) : null}
    </div>
  );
};

export default OrderDetail;
