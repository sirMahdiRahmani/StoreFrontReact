import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useAddCartItem } from "../hooks/useCart";
import { Breadcrumb } from "../components/Breadcrumb";
import { PricePersian } from "../components/PricePersian";
import { StockPill } from "../components/StockPill";
import { QuantityStepper } from "../components/QuantityStepper";

export function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(slug);
  const addCartItem = useAddCartItem();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return <div className="px-4 py-12 text-center text-text-2">در حال بارگذاری…</div>;
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-text-2">
        <p>بارگذاری محصول ممکن نشد. دوباره تلاش کنید.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-pill border border-line px-4 py-2 text-sm text-text-1"
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  const price = Number(product.prices.price) / 10 ** product.prices.currency_minor_unit;
  const regularPrice =
    Number(product.prices.regular_price) / 10 ** product.prices.currency_minor_unit;

  return (
    <div className="px-4 py-6">
      <Breadcrumb
        items={[{ label: "خانه", to: "/" }, { label: "فروشگاه", to: "/shop" }, { label: product.name }]}
      />

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="order-2 lg:order-1 lg:col-start-2">
          <div className="aspect-square overflow-hidden rounded-card bg-photo-bg">
            {product.images[activeImage] && (
              <img
                src={product.images[activeImage].src}
                alt={product.images[activeImage].alt || product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.slice(0, 5).map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-chip border-2 ${
                  i === activeImage ? "border-text-1" : "border-line"
                }`}
              >
                <img src={img.src} alt={img.alt || product.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:col-start-1 lg:row-start-1">
          <h1 className="font-display text-2xl text-text-1">{product.name}</h1>
          <PricePersian price={price} regularPrice={regularPrice} />
          <StockPill inStock={product.is_in_stock} />

          <div className="flex items-center gap-3">
            <span className="text-sm text-text-2">تعداد</span>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </div>

          <button
            type="button"
            disabled={!product.is_in_stock || addCartItem.isPending}
            onClick={() => addCartItem.mutate({ id: product.id, quantity })}
            className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on disabled:opacity-50"
          >
            {addCartItem.isPending ? "در حال افزودن…" : "افزودن به سبد خرید"}
          </button>

          {addCartItem.isError && (
            <p className="text-sm text-text-2">افزودن به سبد خرید ممکن نشد. دوباره تلاش کنید.</p>
          )}

          {product.description && (
            <div
              className="prose prose-sm mt-4 text-text-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
