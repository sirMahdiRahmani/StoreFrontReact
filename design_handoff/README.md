# Regalia Storefront — Frontend Handoff (RTL / Persian)

Everything the React + TypeScript + Tailwind agent needs to build the **mobile-first,
right-to-left, Persian (fa-IR)** storefront. Guest checkout, no accounts.

## Open this first
- **`regalia-storefront-fa.html`** — self-contained, offline. Open in any browser to see
  all **13 phone screens** live (fonts, RTL, light theme, image slots baked in). This is
  the pixel reference. *(Drag your own product photos onto the image tiles to preview.)*

## Specs (read in this order)
1. **`FRONTEND_SPEC_FA_RTL.md`** — the RTL/Persian build guide. Logical-property mappings,
   Vazirmatn + Markazi Text type, Persian-numeral + تومان helpers, all 13 screens, the
   Zarinpal guest-payment flow, dark mode, responsive rules, a11y. **This wins for fa-IR.**
2. **`FRONTEND_SPEC.md`** — base spec: component tree, props, WooCommerce Store API mapping.
   Direction-agnostic; still applies underneath the RTL addendum.

## Tokens
- **`tokens.css`** — single source of truth for all `--*` custom properties. Light +
  dark (`[data-theme="dark"]`) and an RTL/Persian font override block (`[dir="rtl"]`).
  Drive Tailwind's theme from these vars so theming + direction swap without touching JSX.

  > Note: the standalone HTML inlines an equivalent token set with shorthand names for
  > preview only. **`tokens.css` is canonical** — build against it.

## Assets
- **`icons/`** — accessory SVGs (necklace, bracelet, earrings, ring, …). Use for the
  **category navigation only** — never as stand-ins for product photography.
- **`Regalia Storefront FA.dc.html`** — editable design source (requires the design tool
  to render; the `.html` bundle above is what to open for reference).

## The 13 screens
خانه · فروشگاه · فیلترها (bottom sheet) · صفحهٔ محصول · سبد خرید ·
تسویه‌حساب · پرداخت موفق · پرداخت ناموفق · در حال بررسی · سبد خالی ·
بارگذاری (skeleton) · ۴۰۴ · دربارهٔ ما / تماس

## Hard rules (don't skip)
- `<html dir="rtl" lang="fa">`; **logical properties only** (`ms/me`, `ps/pe`, `start/end`).
- Mobile-first, min 44px hit targets; flip directional icons (`rtl:-scale-x-100`).
- Persian numerals + `٬` separator for all displayed numbers; `… تومان` for price.
- Latin/numeric fields (phone, email, postal, SKU, codes) → `dir="ltr"`.
- Guest checkout only. On payment failure the cart must survive untouched.
- Type: Vazirmatn (UI/body) + Markazi Text (Persian display). No Marcellus/Outfit in fa.
