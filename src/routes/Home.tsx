import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { ProductGridSkeleton } from "../components/ProductGridSkeleton";

export function Home() {
  const { data: products, isLoading, isError, refetch } = useProducts({ featured: 1, per_page: 4 });

  return (
    <div>
      <section className="bg-surface-2 px-4 py-12 text-center">
        <p className="font-body text-xs tracking-[0.14em] text-gilt">دست‌ساز، با عشق</p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.12] text-text-1">
          هر قطعه، روایتی برای خودش
        </h1>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on"
        >
          ادامهٔ خرید
        </Link>
      </section>

      <section className="px-4 py-8">
        <h2 className="mb-4 font-display text-xl text-text-1">محصولات منتخب</h2>
        {isLoading && <ProductGridSkeleton count={4} />}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center text-text-2">
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
        {products && <ProductGrid products={products} />}
      </section>
    </div>
  );
}
