import { Diamond } from "./icons";

const MESSAGES = ["ارسال رایگان سفارش‌های بالای ۵۰۰ هزار تومان", "۷ روز ضمانت بازگشت کالا", "دست‌ساز در ایران"];

/**
 * Slim announcement bar above the header. Uses the dedicated banner tokens
 * (deep purple ground, warm ivory text) so it reads as part of the brand
 * rather than a generic promo strip.
 */
export function AnnouncementBanner() {
  return (
    <div className="bg-banner-bg text-banner-fg">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2 text-[11px] tracking-[0.04em] sm:text-xs">
        {MESSAGES.map((msg, i) => (
          <span key={msg} className="flex items-center gap-3">
            {i > 0 && <Diamond className="hidden h-1 w-1 opacity-70 sm:inline-block" />}
            <span className={i > 0 ? "hidden sm:inline" : ""}>{msg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
