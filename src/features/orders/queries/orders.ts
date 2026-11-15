import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { OrderService } from "@/features/orders/api/orderService";

// Live updates (lib/sse) invalidate ["orders"], refreshing list and detail.
export const useOrders = () =>
  useInfiniteQuery({
    queryKey: ["orders", "list"],
    queryFn: ({ pageParam }) => OrderService.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ["orders", "detail", id],
    queryFn: () => OrderService.get(id),
  });

const useOrderAction = <T>(mutationFn: (variables: T) => Promise<void>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useRequestCancellation = (id: string) =>
  useOrderAction((reason: string) =>
    OrderService.requestCancellation(id, reason),
  );

export const useRequestReturn = (id: string) =>
  useOrderAction((reason: string) => OrderService.requestReturn(id, reason));

export const useAddOrderNote = (id: string) =>
  useOrderAction((content: string) => OrderService.addNote(id, content));
