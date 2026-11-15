import { api } from "@/lib/api/client";
import type { ApiSuccess, Pagination } from "@/types/api";
import type { Order, OrderDetail } from "@/features/orders/types/order";

const PAGE_SIZE = 20;

export const OrderService = {
  list: async (page: number) => {
    const response = await api.get<
      ApiSuccess<Order[], { pagination: Pagination }>
    >("/orders", { params: { page, limit: PAGE_SIZE } });
    return {
      orders: response.data.data,
      pagination: response.data.meta.pagination,
    };
  },

  get: async (id: string): Promise<OrderDetail> => {
    const response = await api.get<ApiSuccess<OrderDetail>>(`/orders/${id}`);
    return response.data.data;
  },

  // Requests only: an admin approves cancellations and returns.
  requestCancellation: async (id: string, reason: string) => {
    await api.post(`/orders/${id}/cancel`, { reason });
  },

  requestReturn: async (id: string, reason: string) => {
    await api.post(`/orders/${id}/return`, { reason });
  },

  addNote: async (id: string, content: string) => {
    await api.post(`/orders/${id}/notes`, { content });
  },
};
