import { faDigits, toman } from "../lib/format";

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface CategoryOption {
  slug: string;
  label: string;
  count: number;
}

interface FilterPanelProps {
  categories: CategoryOption[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
  priceBounds: { min: number; max: number };
  resultCount: number;
  onApply: () => void;
}

export function FilterPanel({
  categories,
  filters,
  onChange,
  priceBounds,
  resultCount,
  onApply,
}: FilterPanelProps) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  return (
    <div
      role="group"
      aria-label="فیلترها"
      className="flex flex-col gap-6 rounded-panel border border-line-card bg-surface p-4 shadow-panel"
    >
      <div role="group" aria-label="دسته‌بندی">
        <h3 className="mb-3 font-display text-sm text-text-1">دسته‌بندی</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center justify-between gap-2 text-sm text-text-2">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                />
                {cat.label}
              </span>
              <span className="text-text-3">{faDigits(cat.count)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm text-text-1">قیمت</h3>
        <div className="flex flex-col gap-2 text-sm text-text-2">
          <label className="flex items-center justify-between gap-2">
            حداقل
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={filters.minPrice}
              onChange={(e) =>
                onChange({ ...filters, minPrice: Math.min(Number(e.target.value), filters.maxPrice) })
              }
              aria-label="حداقل قیمت"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            حداکثر
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: Math.max(Number(e.target.value), filters.minPrice) })
              }
              aria-label="حداکثر قیمت"
            />
          </label>
          <p className="text-text-3">
            {toman(filters.minPrice)} تا {toman(filters.maxPrice)}
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-2">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
        />
        فقط موجود
      </label>

      <button
        type="button"
        onClick={onApply}
        className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on"
      >
        نمایش {faDigits(resultCount)} محصول
      </button>
    </div>
  );
}
