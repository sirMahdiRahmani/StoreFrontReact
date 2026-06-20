import { toman } from "../lib/format";

interface PricePersianProps {
  price: number;
  regularPrice?: number;
}

export function PricePersian({ price, regularPrice }: PricePersianProps) {
  const onSale = regularPrice && regularPrice > price;

  return (
    <span className="inline-flex items-baseline gap-2 font-body font-bold">
      <span className={onSale ? "text-gilt" : "text-text-1"}>{toman(price)}</span>
      {onSale && (
        <span className="text-text-3 text-sm line-through font-normal">{toman(regularPrice!)}</span>
      )}
    </span>
  );
}
