import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { PricePersian } from "./PricePersian";
import { StockPill } from "./StockPill";

export function ProductCard({ product }: { product: Product }) {
  const price = Number(product.prices.price) / 10 ** product.prices.currency_minor_unit;
  const regularPrice =
    Number(product.prices.regular_price) / 10 ** product.prices.currency_minor_unit;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line-card bg-surface shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="aspect-square bg-photo-bg">
        {product.images[0] && (
          <img
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="font-display text-base text-text-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <PricePersian price={price} regularPrice={regularPrice} />
          <StockPill inStock={product.is_in_stock} />
        </div>
      </div>
    </Link>
  );
}
