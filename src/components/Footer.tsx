import { Link } from "react-router-dom";
import { GiltDivider } from "./Divider";
import { InstagramIcon, PhoneIcon } from "./icons";
import { faDigits } from "../lib/format";

const SHOP_LINKS = [
  { to: "/shop", label: "همهٔ محصولات" },
  { to: "/cart", label: "سبد خرید" },
  { to: "/about", label: "دربارهٔ ما" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-display text-2xl text-text-1">ملورا</span>
              <span className="mt-0.5 text-[10px] tracking-[0.34em] text-gilt">mellora</span>
            </Link>
            <p className="max-w-xs text-sm text-text-3">
              زیورآلات دست‌ساز، ساخته‌شده با دقت و عشق به جزئیات.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5">
            <h3 className="font-display text-sm text-text-1">فروشگاه</h3>
            {SHOP_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-text-2 transition-colors hover:text-text-1">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <h3 className="font-display text-sm text-text-1">تماس</h3>
            <a href="tel:+982112345678" className="flex items-center gap-2 text-sm text-text-2 transition-colors hover:text-text-1">
              <PhoneIcon className="h-4 w-4 text-gilt" />
              <span dir="ltr">{faDigits("021-12345678")}</span>
            </a>
            <a
              href="https://instagram.com/mellora.shop"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-text-2 transition-colors hover:text-text-1"
            >
              <InstagramIcon className="h-4 w-4 text-gilt" />
              mellora.shop@
            </a>
          </div>
        </div>

        <GiltDivider className="my-8" />

        <p className="text-center text-xs text-text-3">
          © {faDigits(1404)} ملورا. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
