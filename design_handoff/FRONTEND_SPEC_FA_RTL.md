# mellora Storefront — RTL / Persian Frontend Spec (React + TS + Tailwind)

Addendum to `FRONTEND_SPEC.md`. Same component tree, tokens, and Woo mapping — this file
covers ONLY what changes for the **mobile-first, right-to-left, Persian (fa-IR)** build.
Visual source of truth: `mellora Storefront FA.dc.html` (13 phone screens).

> Everything in the base spec still applies. Where the two disagree on direction, type,
> numerals, or breakpoints, **this file wins** for the fa-IR locale.

---

## 0. Non-negotiables

- Root: `<html dir="rtl" lang="fa">`. Never hard-code `left`/`right` — use **logical
  properties** everywhere (`ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`,
  `text-start`/`text-end`, `inset-inline-*`, `border-s`/`border-e`).
- **Mobile-first.** Design baseline is a 392px phone. Lay out for one column first, then
  scale up with `sm/lg/xl`. Min hit target **44px**.
- **Persian numerals** for all user-facing numbers (prices, counts, ratings, pagination,
  order IDs that are numeric). Keep technical IDs/codes (SKU, tracking code, error code)
  in Latin and wrap them in `dir="ltr"`.
- **Currency:** تومان. Thousands separated with the Persian comma `٬` →
  `۲٬۴۵۰٬۰۰۰ تومان`. Unit label sits after the number.
- Fields that hold Latin/numeric data (phone, email, postal code, card) get
  `dir="ltr"` + `text-left` even inside the RTL form.

---

## 1. Direction utilities (Tailwind)

Enable logical-property plugin behavior; prefer these mappings:

| Physical (avoid) | Logical (use) |
|---|---|
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `rounded-l/-r` | `rounded-s/-e` |
| `border-l/-r` | `border-s/-e` |

**Directional icons must flip.** Back chevrons, "continue" arrows, breadcrumb separators,
pagination prev/next point the opposite way in RTL. Either mirror with
`rtl:-scale-x-100` or swap the glyph (use `‹ ›` reversed). Breadcrumb separator is `‹`.

---

## 2. Type & numerals

```ts
// next/font or <link>
display: '"Markazi Text", serif'   // Persian titles, headings, prices-as-display
body:    '"Vazirmatn", sans-serif' // UI, body, labels, buttons
```

Replaces Marcellus/Outfit for fa-IR. Keep weights: Vazirmatn 300/400/500/600/700,
Markazi Text 400/500/600/700. Persian text runs taller — use `leading-[1.9]`–`2.05` for
body, `leading-[1.12]` for display.

```ts
// format helpers — use everywhere a number is rendered
const faDigits = (s: string | number) =>
  String(s).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);

export const toman = (n: number) =>
  faDigits(n.toLocaleString("en-US").replace(/,/g, "٬")) + " تومان";
// toman(2450000) -> "۲٬۴۵۰٬۰۰۰ تومان"
```

| Use | Recipe (fa-IR) |
|---|---|
| Page / hero title | `font-display text-[30px] text-regal-900 font-semibold leading-[1.12]` |
| Product title | `font-display text-[18px] text-regal-900` |
| Eyebrow / category | `font-body text-[11px] font-medium tracking-[0.14em] text-gilt-deep` |
| Body | `font-body text-[13.5px] leading-[1.95] text-regal-500 font-light` |
| Price | `font-body font-bold text-ink` (sale price → `text-gilt-deep`, original → `line-through text-regal-300`) |

---

## 3. Screens to build (from the DC)

Mobile screens, in flow order — each maps to the matching `data-screen-label` in
`mellora Storefront FA.dc.html`:

1. **خانه (Home)** — sticky header (logo · search · cart-badge · menu), free-shipping bar,
   gilt-framed hero with light-catch glow, 4-up category strip (accessory icons), 2-col
   featured grid, footer with trust badges.
2. **فروشگاه (Shop)** — search bar, breadcrumb + sort, filter chips, result count,
   2-col card grid (sale / in-stock / out-of-stock states), pagination.
3. **فیلترها (Filter sheet)** — bottom sheet (mobile pattern, not sidebar): category
   checkboxes w/ counts, dual-handle price range, in-stock toggle, apply CTA with live count.
4. **صفحهٔ محصول (Product)** — gallery (main + 4 thumbs, active `border-ink`), eyebrow,
   title, star row, price + strike, stock pill, qty stepper + wishlist, add-to-cart, meta
   list, tabs (توضیحات/مشخصات/دیدگاه‌ها).
5. **سبد خرید (Cart)** — line rows (thumb, title, qty stepper, line price, remove),
   coupon field, sticky-feeling summary panel, checkout CTA.
6. **تسویه‌حساب (Checkout)** — guest only, no account. Order summary, recipient form
   (نام/نام خانوادگی/موبایل/ایمیل/نشانی/شهر/کد پستی — LTR on numeric fields), totals,
   "انتقال به درگاه پرداخت" → redirect to gateway (Zarinpal/زرین‌پال).
7. **پرداخت موفق (Success)** — check mark, order number, tracking code (`dir="ltr"`).
8. **پرداخت ناموفق (Failed)** — cross, reassurance ("مبلغی کسر نشد"), retry + back-to-cart.
9. **در حال بررسی (Verifying)** — spinner while gateway callback confirms.
10. **سبد خالی (Empty cart)** — icon, message, back-to-shop CTA.
11. **بارگذاری (Loading)** — shimmer skeleton grid.
12. **۴۰۴** — big numeral, message, home CTA.
13. **دربارهٔ ما / تماس (About/Contact)** — workshop image, story, phone + Instagram rows.

---

## 4. Payment flow (guest checkout, IR gateway)

```
Checkout → POST create payment → redirect to gateway (Zarinpal)
        → gateway callback hits /verify
            → Verifying screen (poll/await)
                → Success (order #, tracking)  | Failed (code, retry)
```

- No login/registration anywhere. Cart is client-side until checkout submit.
- On Failed, the cart must survive untouched ("سبد خرید شما دست‌نخورده باقی مانده").
- Tracking/error codes render Latin + `dir="ltr"`; order number numeric → Persian digits,
  the `#RGL-...` prefix stays Latin.

---

## 5. Tokens & theming

Use `design_handoff/tokens.css` as the source of `--*` names. fa build adds a **dark mode**
driven by the same token names under `[data-mode="dark"]` (see the DC `:root` /
`[data-mode="dark"]` blocks for exact hex), plus the existing Emerald palette under
`[data-theme="emerald"]`. Drive Tailwind colors from the CSS vars so both `data-mode` and
`data-theme` swap without touching markup.

Key token roles (light): primary `#5B3A7E`, primary-deep `#38215A`, gilt `#CBA24E`,
gilt-deep `#A8822F`, app bg `#FAF7F2`, card `#FFFFFF`, sunken `#F4EEF8`, heading `#2D1B3D`,
body `#6A5A78`, muted `#9A86A8`, line `#E7DDEC`.

---

## 6. Responsive (scale up from mobile)

- Product grid: 1 col base → 2 `sm` → 3 `lg` → 4 `xl`.
- Filters: **bottom sheet** on mobile/tablet → left **sidebar** (logical `start`) at `lg+`.
- Product page: stacked base → gallery `start` / buy-panel `end` two-column at `lg+`.
- Cart/checkout: summary below content base → alongside at `lg+`.
- Header search collapses to an icon below `sm`.

---

## 7. Accessibility (RTL)

- `aria-label`s in Persian on icon-only buttons (جستجو، حساب، سبد، حذف، علاقه‌مندی).
- Star rating: `aria-label="۴ از ۵ امتیاز"` (or numeric in `aria-valuenow` with English).
- Filter checkbox groups `role="group"`; price range handles labelled حداقل/حداکثر.
- Visible focus ring `focus-visible:ring-2 ring-gilt`.
- `prefers-reduced-motion`: disable shimmer + spinner animation.

---

## 8. Source-of-truth files in this handoff

- `mellora Storefront FA.dc.html` — all 13 RTL phone screens, token-driven, light/dark + emerald.
- `FRONTEND_SPEC.md` — base (LTR) spec: component tree, props, Woo Store API mapping.
- `design_handoff/tokens.css` — canonical CSS custom properties.
- `mellora-purple/icons/*.svg` — accessory icons for **category nav only** (never product images).
