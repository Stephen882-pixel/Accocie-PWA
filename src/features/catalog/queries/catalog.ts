import {
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { CatalogService } from "@/features/catalog/api/catalogService";
import type { ProductFilters } from "@/features/catalog/types/catalog";

export const useCategories = () =>
  useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: CatalogService.getCategories,
    // Categories change rarely.
    staleTime: 10 * 60 * 1000,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["catalog", "featured"],
    queryFn: () => CatalogService.getFeatured(),
  });

/** One page at a time; `fetchNextPage` loads more. Search ignores category and sort. */
export const useProductList = ({ q, category, sort }: ProductFilters) =>
  useInfiniteQuery({
    queryKey: ["catalog", "products", { q, category, sort }],
    queryFn: ({ pageParam }) =>
      q
        ? CatalogService.searchProducts(q, pageParam)
        : CatalogService.getProducts({ category, sort, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
  });

export const productQuery = (id: string) =>
  queryOptions({
    queryKey: ["catalog", "product", id],
    queryFn: () => CatalogService.getProduct(id),
  });
