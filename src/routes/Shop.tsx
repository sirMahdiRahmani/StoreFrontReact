import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { ProductGridSkeleton } from "../components/ProductGridSkeleton";
import { Breadcrumb } from "../components/Breadcrumb";
import { FilterPanel, type FilterState } from "../components/FilterPanel";
import { faDigits } from "../lib/format";
import type { Product } from "../types/product";

const SORT_OPTIONS = [
  { value: "date", label: "جدیدترین" },
  { value: "price", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

function priceOf(product: Product) {
  return Number(product.prices.price) / 10 ** product.prices.currency_minor_unit;
}

export function Shop() {
  const [orderby, setOrderby] = useState("date");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: products, isLoading, isError, refetch } = useProducts({ orderby });

  const priceBounds = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 0 };
    const prices = products.map(priceOf);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    minPrice: 0,
    maxPrice: 0,
    inStockOnly: false,
  });

  const categoryOptions = useMemo(() => {
    if (!products) return [];
    const bySlug = new Map<string, { slug: string; label: string; count: number }>();
    for (const product of products) {
      for (const cat of product.categories ?? []) {
        const existing = bySlug.get(cat.slug);
        if (existing) existing.count += 1;
        else bySlug.set(cat.slug, { slug: cat.slug, label: cat.name, count: 1 });
      }
    }
    return [...bySlug.values()];
  }, [products]);

  const effectiveFilters: FilterState = useMemo(
    () => ({
      ...filters,
      minPrice: filters.maxPrice === 0 ? priceBounds.min : filters.minPrice,
      maxPrice: filters.maxPrice === 0 ? priceBounds.max : filters.maxPrice,
    }),
    [filters, priceBounds],
  );

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const price = priceOf(product);
      const matchesCategory =
        effectiveFilters.categories.length === 0 ||
        (product.categories ?? []).some((c) => effectiveFilters.categories.includes(c.slug));
      const matchesPrice = price >= effectiveFilters.minPrice && price <= effectiveFilters.maxPrice;
      const matchesStock = !effectiveFilters.inStockOnly || product.is_in_stock;
      return matchesCategory && matchesPrice && matchesStock;
    });
  }, [products, effectiveFilters]);

  return (
    <div className="px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "فروشگاه" }]} />

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-1">فروشگاه</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="rounded-chip border border-line px-3 py-2 text-sm text-text-1 lg:hidden"
          >
            فیلترها
          </button>
          <label className="flex items-center gap-2 text-sm text-text-2">
            مرتب‌سازی
            <select
              value={orderby}
              onChange={(e) => setOrderby(e.target.value)}
              className="rounded-chip border border-line bg-surface px-3 py-2"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {products && (
        <p className="mt-2 text-sm text-text-3">{faDigits(filteredProducts.length)} محصول</p>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          {products && products.length > 0 && (
            <FilterPanel
              categories={categoryOptions}
              filters={effectiveFilters}
              onChange={setFilters}
              priceBounds={priceBounds}
              resultCount={filteredProducts.length}
              onApply={() => {}}
            />
          )}
        </aside>

        <div>
          {isLoading && <ProductGridSkeleton />}
          {isError && (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-text-2">
              <p>بارگذاری محصولات ممکن نشد. دوباره تلاش کنید.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-pill border border-line px-4 py-2 text-sm text-text-1"
              >
                تلاش دوباره
              </button>
            </div>
          )}
          {products && filteredProducts.length === 0 && !isLoading && !isError && (
            <p className="py-12 text-center text-text-2">
              محصولی پیدا نشد. می‌توانید دسته‌بندی دیگری را ببینید.
            </p>
          )}
          {filteredProducts.length > 0 && <ProductGrid products={filteredProducts} />}
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-20 flex items-end bg-shade/40 lg:hidden">
          <div className="w-full rounded-t-panel bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-text-1">فیلترها</h2>
              <button type="button" aria-label="بستن" onClick={() => setSheetOpen(false)} className="text-text-2">
                ✕
              </button>
            </div>
            <FilterPanel
              categories={categoryOptions}
              filters={effectiveFilters}
              onChange={setFilters}
              priceBounds={priceBounds}
              resultCount={filteredProducts.length}
              onApply={() => setSheetOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
