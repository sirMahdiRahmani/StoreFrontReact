import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/ProductGrid";
import { ProductGridSkeleton } from "../components/ProductGridSkeleton";
import { SectionHeading } from "../components/SectionHeading";
import { GiltDivider } from "../components/Divider";
import { Reveal } from "../components/Reveal";
import { Diamond, ArrowLeftIcon } from "../components/icons";
import type { Product } from "../types/product";

const VALUES = [
  { title: "دست‌ساز", body: "هر قطعه در کارگاه ما به‌صورت دستی ساخته می‌شود." },
  { title: "ارسال امن", body: "بسته‌بندی ویژه و ارسال بیمه‌شده به سراسر کشور." },
  { title: "ضمانت اصالت", body: "۷ روز ضمانت بازگشت و اصالت کالا." },
];

export function Home() {
  const { data: products, isLoading, isError, refetch } = useProducts({ featured: 1, per_page: 4 });
  const heroProduct = products?.[0] as Product | undefined;
  const heroImage = heroProduct?.images?.[0]?.src;

  return (
    <div>
      {/* Hero — editorial two-column: framed photo + serif thesis */}
      <section className="grid items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div className="reveal reveal-1 order-2 flex flex-col items-start gap-6 lg:order-1">
          <span className="flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-gilt">
            <Diamond className="h-1 w-1" />
            دست‌ساز، با عشق
          </span>
          <h1 className="font-display text-4xl leading-[1.1] text-text-1 sm:text-5xl">
            هر قطعه،
            <br />
            روایتی برای خودش
          </h1>
          <p className="max-w-md text-text-2">
            زیورآلاتی که با دقت طراحی و با دست تکمیل می‌شوند — برای لحظه‌هایی که می‌خواهید به یاد بمانند.
          </p>
          <div className="flex items-center gap-5 pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-pill bg-brand-solid px-7 py-3 font-medium text-brand-on transition-colors hover:bg-shade"
            >
              ادامهٔ خرید
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="text-sm text-text-2 underline decoration-gilt/60 underline-offset-4 transition-colors hover:text-text-1"
            >
              دربارهٔ ملورا
            </Link>
          </div>
        </div>

        <div className="reveal reveal-2 gilt-frame order-1 aspect-[4/5] overflow-hidden rounded-panel bg-photo-bg lg:order-2">
          {heroImage ? (
            <img
              src={heroImage}
              alt={heroProduct?.name ?? "محصول منتخب ملورا"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Diamond className="h-4 w-4 opacity-40" />
            </div>
          )}
        </div>
      </section>

      {/* Values strip */}
      <section className="border-y border-line bg-surface-2">
        <div className="grid gap-6 px-4 py-8 sm:grid-cols-3 sm:gap-4">
          {VALUES.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 90}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <Diamond />
              <h3 className="font-display text-base text-text-1">{v.title}</h3>
              <p className="max-w-[16rem] text-sm text-text-3">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="px-4 py-14">
        <Reveal>
          <SectionHeading eyebrow="منتخب کارگاه" title="محصولات منتخب" className="mb-8" />
        </Reveal>
        {isLoading && <ProductGridSkeleton count={4} />}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center text-text-2">
            <p>بارگذاری محصولات ممکن نشد. دوباره تلاش کنید.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-pill border border-line px-4 py-2 text-sm text-text-1 transition-colors hover:border-brand hover:text-brand"
            >
              تلاش دوباره
            </button>
          </div>
        )}
        {products && <ProductGrid products={products} />}
        {products && products.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-pill border border-line px-7 py-3 text-sm font-medium text-text-1 transition-colors hover:border-brand hover:text-brand"
            >
              مشاهدهٔ همهٔ محصولات
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Brand-story band */}
      <Reveal as="section" className="bg-brand-solid px-4 py-16 text-center text-brand-on">
        <GiltDivider className="mb-6" />
        <p className="mx-auto max-w-2xl font-display text-2xl leading-relaxed sm:text-3xl">
          ما باور داریم زیبایی در جزئیاتی‌ست که با دست ساخته می‌شوند.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-brand-on/70">
          ملورا — ساخته‌شده با دقت و عشق به جزئیات.
        </p>
      </Reveal>
    </div>
  );
}
