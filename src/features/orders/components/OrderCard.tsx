import { Link } from "react-router";
import { formatDate, formatPrice } from "@/lib/utils/format";
import OrderStatusBadge from "@/features/orders/components/OrderStatusBadge";
import { STATUS_HINT } from "@/features/orders/utils/status";
import type { Order } from "@/features/orders/types/order";

const OrderCard = ({ order }: { order: Order }) => {
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const names = order.items.map((item) => item.productName).join(", ");

  return (
    <Link
      to={`/orders/${order.id}`}
      className="flex flex-col gap-1.5 rounded-card border border-grey-300 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm font-semibold">
          {order.orderNumber}
        </span>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="truncate text-sm">{names}</p>
      <p className="text-xs text-grey-700">
        {formatDate(order.created_at)} · {units}{" "}
        {units === 1 ? "item" : "items"}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <span className="text-[13px] text-grey-700">
          {STATUS_HINT[order.status]}
        </span>
        <span className="text-[15px] font-bold">
          {formatPrice(order.totalAmount)}
        </span>
      </div>
    </Link>
  );
};

export default OrderCard;
