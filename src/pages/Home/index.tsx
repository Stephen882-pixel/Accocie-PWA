import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import QueryError from "@/components/feedback/QueryError";
import Button from "@/components/ui/Button";
import { toApiError } from "@/lib/api/apiError";
import CategoryChips from "@/features/catalog/components/CategoryChips";
import FeaturedRow from "@/features/catalog/components/FeaturedRow";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/features/catalog/components/ProductGrid";
import {
  useCategories,
  useProductList,
} from "@/features/catalog/queries/catalog";
import type { ProductSort } from "@/features/catalog/types/catalog";

const SORT_LABELS: Record<ProductSort, string> = {
  newest: "Newest",
  popular: "Best selling",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};

const isSort = (value: string | null): value is ProductSort =>
  value !== null && value in SORT_LABELS;

/**
 * The marketplace. Search, category and sort live in the URL, so the back
 * button, a refresh and a shared link all keep them.
 */
const Home = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? undefined;
  const category = params.get("category") ?? undefined;
  const sortParam = params.get("sort");
  const sort: ProductSort = isSort(sortParam) ? sortParam : "newest";

  const { data: categories } = useCategories();
  const list = useProductList({ q, category, sort });
  const products = list.data?.pages.flatMap((page) => page.products) ?? [];

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q")).trim();
    update({ q: value || undefined, category: undefined });
  };

  const heading = q
    ? `Results for “${q}”`
    : category
      ? (categories?.find((c) => c.id === category)?.name ?? "Products")
      : "All products";

  return (
    <div className="flex flex-col gap-5 py-4">
      <form role="search" onSubmit={handleSearch}>
        <label className="flex h-11 items-center gap-2.5 rounded-full bg-grey-100 px-4 text-grey-700 focus-within:ring-2 focus-within:ring-primary">
          <Search size={18} aria-hidden="true" />
          <input
            key={q ?? ""}
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products"
            aria-label="Search products"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none"
          />
        </label>
      </form>

      {q ? null : (
        <CategoryChips
          selected={category}
          onSelect={(id) => update({ category: id })}
        />
      )}

      {!q && !category ? <FeaturedRow /> : null}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-lg font-semibold">{heading}</h2>
          {q ? (
            <button
              type="button"
              onClick={() => update({ q: undefined })}
              className="flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-primary"
            >
              <X size={16} aria-hidden="true" />
              Clear search
            </button>
          ) : (
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(event) =>
                update({
                  sort:
                    event.target.value === "newest"
                      ? undefined
                      : event.target.value,
                })
              }
              className="h-10 shrink-0 rounded-control border border-grey-300 bg-background px-2 text-sm"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
        </div>

        {list.isPending ? (
          <ProductGridSkeleton />
        ) : list.isError ? (
          <QueryError
            message={toApiError(list.error).message}
            onRetry={() => list.refetch()}
          />
        ) : products.length === 0 ? (
          <p className="rounded-card border border-grey-300 px-6 py-10 text-center text-[15px] text-grey-700">
            {q
              ? "No products match your search. Try other words."
              : "No products here yet."}
          </p>
        ) : (
          <ProductGrid products={products} />
        )}

        {list.hasNextPage ? (
          <Button
            variant="secondary"
            onClick={() => list.fetchNextPage()}
            isLoading={list.isFetchingNextPage}
          >
            Show more
          </Button>
        ) : null}
      </section>
    </div>
  );
};

export default Home;
