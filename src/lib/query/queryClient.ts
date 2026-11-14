import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Catalogue data changes slowly; a minute avoids refetching on every
      // tab switch without letting prices go noticeably stale.
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
