interface StockPillProps {
  inStock: boolean;
}

export function StockPill({ inStock }: StockPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium ${
        inStock ? "bg-brand-soft text-brand" : "bg-surface-2 text-text-3"
      }`}
    >
      {inStock ? "موجود" : "ناموجود"}
    </span>
  );
}
