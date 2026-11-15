import { STATUS_LABEL, STATUS_TONE } from "@/features/orders/utils/status";
import type { OrderStatus } from "@/features/orders/types/order";

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_TONE[status]}`}
  >
    {STATUS_LABEL[status]}
  </span>
);

export default OrderStatusBadge;
