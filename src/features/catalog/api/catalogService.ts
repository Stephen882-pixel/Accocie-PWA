import { api } from "@/lib/api/client";
import type { ApiSuccess, Pagination } from "@/types/api";
import type {
  Category,
  Product,
  ProductPage,
  ProductSort,
} from "@/features/catalog/types/catalog";

const PAGE_SIZE = 20;

const SORT_PARAMS: Record<ProductSort, { sortBy: string; order: string }> = {
  newest: { sortBy: "created_at", order: "DESC" },
  price_asc: { sortBy: "price", order: "ASC" },
  price_desc: { sortBy: "price", order: "DESC" },
  popular: { sortBy: "soldCount", order: "DESC" },
};

type PagedResponse = ApiSuccess<Product[], { pagination: Pagination }>;

export const CatalogService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<ApiSuccess<Category[]>>("/categories");
    return response.data.data;
  },

  getProducts: async ({
    category,
    sort,
    page,
  }: {
    category?: string;
    sort: ProductSort;
    page: number;
  }): Promise<ProductPage> => {
    const response = await api.get<PagedResponse>("/products", {
      params: { category, page, limit: PAGE_SIZE, ...SORT_PARAMS[sort] },
    });
    return {
      products: response.data.data,
      pagination: response.data.meta.pagination,
    };
  },

  // Search matches name, description and tags. It takes no category or sort.
  searchProducts: async (q: string, page: number): Promise<ProductPage> => {
    const response = await api.get<PagedResponse>("/products/search", {
      params: { q, page, limit: PAGE_SIZE },
    });
    return {
      products: response.data.data,
      pagination: response.data.meta.pagination,
    };
  },

  getFeatured: async (limit = 8): Promise<Product[]> => {
    const response = await api.get<ApiSuccess<Product[]>>(
      "/products/featured",
      { params: { limit } },
    );
    return response.data.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiSuccess<Product>>(`/products/${id}`);
    return response.data.data;
  },
};
