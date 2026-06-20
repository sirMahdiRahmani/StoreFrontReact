import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useAddCartItem } from "../hooks/useCart";
import { Breadcrumb } from "../components/Breadcrumb";
import { PricePersian } from "../components/PricePersian";
import { StockPill } from "../components/StockPill";
import { QuantityStepper } from "../components/QuantityStepper";
import { BagIcon, Diamond } from "../components/icons";

export function Product() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const addCartItem = useAddCartItem();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-text-2">در حال بارگذاری…</div>;
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-16 text-center text-text-2">
        <p>بارگذاری محصول ممکن نشد. دوباره تلاش کنید.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-pill border border-line px-4 py-2 text-sm text-text-1 transition-colors hover:border-brand hover:text-brand"
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  const price = Number(product.prices.price) / 10 ** product.prices.currency_minor_unit;
  const regularPrice =
    Number(product.prices.regular_price) / 10 ** product.prices.currency_minor_unit;
  const category = product.categories?.[0]?.name;

  return (
    <div className="px-4 py-6">
      <Breadcrumb
        items={[{ label: "خانه", to: "/" }, { label: "فروشگاه", to: "/shop" }, { label: product.name }]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="reveal reveal-1 order-2 lg:order-1 lg:col-start-2">
          <div className="gilt-frame aspect-square overflow-hidden rounded-panel bg-photo-bg">
            {product.images[activeImage] && (
              <img
                src={product.images[activeImage].src}
                alt={product.images[activeImage].alt || product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  aria-label={`تصویر ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-chip border-2 transition-colors ${
                    i === activeImage ? "border-gilt" : "border-line hover:border-line-card"
                  }`}
                >
                  <img src={img.src} alt={img.alt || product.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="reveal reveal-2 order-1 flex flex-col gap-5 lg:order-2 lg:col-start-1 lg:row-start-1">
          {category && (
            <span className="flex items-center gap-2 text-xs tracking-[0.12em] text-gilt">
              <Diamond className="h-1 w-1" />
              {category}
            </span>
          )}
          <h1 className="font-display text-3xl leading-tight text-text-1">{product.name}</h1>

          <span className="text-2xl">
            <PricePersian price={price} regularPrice={regularPrice} />
          </span>

          <span className="h-px w-full bg-line" aria-hidden="true" />

          <StockPill inStock={product.is_in_stock} />

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-2">تعداد</span>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </div>

          <button
            type="button"
            disabled={!product.is_in_stock || addCartItem.isPending}
            onClick={() => addCartItem.mutate({ id: product.id, quantity })}
            className="inline-flex items-center justify-center gap-2 rounded-pill bg-brand-solid px-6 py-3.5 font-medium text-brand-on transition-colors hover:bg-shade disabled:opacity-50"
          >
            <BagIcon className="h-5 w-5" />
            {addCartItem.isPending ? "در حال افزودن…" : "افزودن به سبد خرید"}
          </button>

          {addCartItem.isError && (
            <p className="text-sm text-text-2">افزودن به سبد خرید ممکن نشد. دوباره تلاش کنید.</p>
          )}

          {product.description && (
            <div
              className="prose prose-sm mt-2 max-w-none border-t border-line pt-5 text-text-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
