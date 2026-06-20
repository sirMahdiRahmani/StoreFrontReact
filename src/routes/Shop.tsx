import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { ProductGridSkeleton } from "../components/ProductGridSkeleton";
import { Breadcrumb } from "../components/Breadcrumb";
import { faDigits } from "../lib/format";

const SORT_OPTIONS = [
  { value: "date", label: "جدیدترین" },
  { value: "price", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export function Shop() {
  const [orderby, setOrderby] = useState("date");
  const { data: products, isLoading, isError, refetch } = useProducts({ orderby });

  return (
    <div className="px-4 py-6">
      <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "فروشگاه" }]} />

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-1">فروشگاه</h1>
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

      {products && (
        <p className="mt-2 text-sm text-text-3">{faDigits(products.length)} محصول</p>
      )}

      <div className="mt-4">
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
        {products && products.length === 0 && (
          <p className="py-12 text-center text-text-2">
            محصولی پیدا نشد. می‌توانید دسته‌بندی دیگری را ببینید.
          </p>
        )}
        {products && products.length > 0 && <ProductGrid products={products} />}
      </div>
    </div>
  );
}
