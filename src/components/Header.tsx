import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { faDigits } from "../lib/format";

export function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display text-xl text-text-1">
          رگالیا
        </Link>
        <nav className="flex items-center gap-4">
          <button type="button" aria-label="جستجو" className="text-text-1">
            🔍
          </button>
          <Link to="/cart" aria-label="سبد خرید" className="relative text-text-1">
            🛍️
            {itemCount > 0 && (
              <span className="absolute -top-2 -end-2 flex h-5 min-w-5 items-center justify-center rounded-pill bg-gilt px-1 text-[11px] font-medium text-gilt-on">
                {faDigits(itemCount)}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
