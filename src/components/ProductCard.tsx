import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { PricePersian } from "./PricePersian";

export function ProductCard({ product }: { product: Product }) {
  const price = Number(product.prices.price) / 10 ** product.prices.currency_minor_unit;
  const regularPrice =
    Number(product.prices.regular_price) / 10 ** product.prices.currency_minor_unit;
  const onSale = regularPrice > price;
  const category = product.categories?.[0]?.name;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line-card bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gilt/50 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-photo-bg">
        {product.images[0] && (
          <img
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {onSale && (
          <span className="absolute top-3 end-3 rounded-pill bg-gilt px-2.5 py-1 text-[11px] font-medium text-gilt-on">
            تخفیف
          </span>
        )}
        {!product.is_in_stock && (
          <span className="absolute bottom-3 start-3 rounded-pill bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-text-3 backdrop-blur">
            ناموجود
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {category && (
          <span className="text-[11px] tracking-[0.1em] text-text-3">{category}</span>
        )}
        <h3 className="font-display text-base leading-snug text-text-1 transition-colors group-hover:text-brand">
          {product.name}
        </h3>
        <div className="mt-1">
          <PricePersian price={price} regularPrice={regularPrice} />
        </div>
      </div>
    </Link>
  );
}
