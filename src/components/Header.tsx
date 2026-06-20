import { Link, NavLink } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { faDigits } from "../lib/format";
import { SearchIcon, BagIcon } from "./icons";

const NAV = [
  { to: "/", label: "خانه", end: true },
  { to: "/shop", label: "فروشگاه", end: false },
  { to: "/about", label: "دربارهٔ ما", end: false },
];

export function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl text-text-1">ملورا</span>
          <span className="mt-0.5 text-[10px] tracking-[0.34em] text-gilt">mellora</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative text-sm transition-colors after:absolute after:-bottom-1.5 after:start-0 after:h-px after:bg-gilt after:transition-all ${
                  isActive
                    ? "text-text-1 after:w-full"
                    : "text-text-2 after:w-0 hover:text-text-1 hover:after:w-full"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <nav className="flex items-center gap-2">
          <button
            type="button"
            aria-label="جستجو"
            className="flex h-10 w-10 items-center justify-center rounded-pill text-text-1 transition-colors hover:bg-hover"
          >
            <SearchIcon />
          </button>
          <Link
            to="/cart"
            aria-label="سبد خرید"
            className="relative flex h-10 w-10 items-center justify-center rounded-pill text-text-1 transition-colors hover:bg-hover"
          >
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-pill bg-gilt px-1 text-[11px] font-medium text-gilt-on">
                {faDigits(itemCount)}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
