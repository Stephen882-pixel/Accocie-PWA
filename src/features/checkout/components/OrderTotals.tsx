import { formatPrice } from "@/lib/utils/format";
import type { CheckoutSummary } from "@/features/checkout/types/checkout";

type OrderTotalsProps = Pick<
  CheckoutSummary,
  "subtotal" | "taxAmount" | "shippingCost" | "totalAmount"
>;

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-grey-700">
    <dt>{label}</dt>
    <dd>{formatPrice(value)}</dd>
  </div>
);

/** The price breakdown. The API computes every figure; nothing is added up here. */
const OrderTotals = ({
  subtotal,
  taxAmount,
  shippingCost,
  totalAmount,
}: OrderTotalsProps) => (
  <dl className="flex flex-col gap-1.5 text-sm">
    <Row label="Subtotal" value={subtotal} />
    <Row label="VAT (16%)" value={taxAmount} />
    <Row label="Delivery" value={shippingCost} />
    <div className="mt-1 flex justify-between text-[17px] font-bold">
      <dt>Total</dt>
      <dd>{formatPrice(totalAmount)}</dd>
    </div>
  </dl>
);

export default OrderTotals;
