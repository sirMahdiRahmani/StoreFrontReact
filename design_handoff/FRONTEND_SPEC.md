# mellora Storefront — Frontend Spec (React + TS + Tailwind)

Build target: a WooCommerce-style storefront. Four core pages — **Shop (catalog)**, **Product (single)**, **Cart**, **Checkout** — plus shared **Header**, **CategoryStrip**, and **Footer**. Visual source of truth: `Storefront Pages.dc.html` + the mellora design system (`styles.css`, `tokens/`).

> Product images are **real photos** — never the accessory icons. The accessory icon set is for **category navigation only** (CategoryStrip, menus, empty states).

---

## 1. Tailwind theme

Map the design tokens into `tailwind.config.ts`. Default palette = Royal Purple; expose Emerald as a `data-theme` variant.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:    "#5B3A7E",   // primary fill / brand
        shade:  "#38215A",   // depth / dark bar
        gilt:   "#CBA24E",   // gold accent
        ivory:  "#FAF7F2",   // app background
        regal: {
          900: "#2D1B3D",    // headings
          700: "#4A3A58",
          500: "#6A5A78",    // body
          300: "#9A86A8",    // muted
        },
        line:   "#E7DDEC",   // dividers
        "line-card": "#ECE4F0",
        hover:  "#F4EEF8",
      },
      fontFamily: {
        display: ['"Marcellus"', "serif"],   // titles
        body: ['"Outfit"', "sans-serif"],    // UI + body
      },
      borderRadius: { chip: "12px", card: "16px", panel: "18px" },
      boxShadow: {
        card: "0 1px 2px rgba(45,27,61,0.04), 0 10px 26px rgba(45,27,61,0.04)",
        "card-hover": "0 16px 34px rgba(45,27,61,0.10)",
        panel: "0 10px 30px rgba(45,27,61,0.05)",
      },
      letterSpacing: { eyebrow: "0.28em" },
    },
  },
} satisfies Config;
```

Load fonts once (Marcellus 400; Outfit 300/400/500/600) via `next/font` or a `<link>`.

### Emerald theme
Wrap in `[data-theme="emerald"]` and override the same CSS vars from `tokens/colors.css` (ink `#1F7A7C`, shade `#0F4D52`, green-tinted neutrals; gilt + ivory unchanged). Easiest path: drive Tailwind colors from CSS variables and swap the variable block under the attribute.

---

## 2. Type & primitives

| Use | Class recipe |
|---|---|
| Page title | `font-display text-[34px] text-regal-900 font-normal` |
| Product title | `font-display text-[19px] text-regal-900` |
| Eyebrow / category | `font-body text-[11px] font-medium tracking-eyebrow uppercase text-regal-300` |
| Body | `font-body text-[15px] leading-[1.65] text-regal-500 font-light` |
| Price | `font-body text-[17px] font-semibold text-ink` |

**Buttons**
- Primary: `bg-ink text-white rounded-chip px-6 py-3.5 font-body text-sm font-medium`
- Gilt (promo): `bg-gilt text-[#3A2A06] …`
- Ghost: `bg-white text-ink border border-ink …`
- Soft add-to-cart: `bg-hover text-ink rounded-[9px] px-3.5 py-2 text-[12.5px]`

**Cards:** `bg-white border border-line-card rounded-card shadow-card`; hover → `-translate-y-1 shadow-card-hover`.
**Inputs:** `border border-line rounded-[10px] px-3.5 py-3 font-body text-sm` + label `text-[12.5px] font-medium text-regal-500`.

---

## 3. Component tree

```
<App>
 ├─ <Header/>            logo · nav · search/account/cart-count
 ├─ <CategoryStrip/>     icon + label chips  ← accessory icons go HERE
 ├─ routes
 │   ├─ /shop      <ShopPage>   <FilterSidebar/> + <Toolbar/> + grid<ProductCard/> + <Pagination/>
 │   ├─ /product/:id <ProductPage> <Gallery/> + <ProductInfo/> (variants, qty, add) + <Tabs/>
 │   ├─ /cart      <CartPage>   <CartTable/> (<CartRow/>) + <CouponForm/> + <OrderSummary/>
 │   └─ /checkout  <CheckoutPage> <BillingForm/> + <PaymentMethods/> + <OrderSummary mini/>
 └─ <Footer/>
```

### Key props (TS)
```ts
type Product = {
  id: string; name: string; category: string;
  price: number; salePrice?: number;
  rating: number; reviewCount: number;
  images: string[];            // REAL photo URLs
  variants?: { label: string; options: string[] }[];
};
type CartLine = { product: Product; qty: number };
```

### ProductCard
Square image (`aspect-square`, `object-cover`, `rounded-t-card`) on `bg-ivory`; optional `SALE` gilt pill top-left; wishlist heart top-right. Below: eyebrow category, display title, star row (gilt ★ filled / `line` empty), price + soft "Add to cart". Strike-through original when `salePrice`.

### FilterSidebar (248px)
Blocks divided by `border-line`: Category (checkboxes w/ counts), Price (dual-handle range), Color (swatch circles), Material (pill toggles). Collapse to a drawer below `lg`.

### Gallery
Main `aspect-square` image + 4-thumb grid; active thumb `border-ink`, rest `border-line-card`.

### OrderSummary
On `bg-ivory` panel: Subtotal / Shipping (Free) / Tax rows, bold Total in `text-ink`, full-width primary CTA, secure-checkout lockup.

---

## 4. WooCommerce mapping (if headless WP/Woo backend)

| UI | Woo Store API |
|---|---|
| Catalog grid | `GET /wc/store/v1/products` (+ `category`, `orderby`, `per_page`, `page`) |
| Filters | `attributes`, `min_price`/`max_price`, `category` query params |
| Product page | `GET /wc/store/v1/products/:id` |
| Cart | `GET/POST /wc/store/v1/cart`, `/cart/add-item`, `/cart/update-item` |
| Coupon | `POST /wc/store/v1/cart/apply-coupon` |
| Checkout | `POST /wc/store/v1/checkout` |

Map `images` → product `<Gallery>`; `prices.price` / `prices.regular_price` → price + strike; `average_rating`/`review_count` → stars.

---

## 5. Responsive
- Grid: 4 cols ≥`xl`, 3 `lg`, 2 `sm`, 1 base. Sidebar → drawer under `lg`.
- Product page two-column → stacked under `lg`.
- Cart/checkout: summary drops below the main column under `lg`.
- Min hit target 44px on all controls.

## 6. Accessibility
- Star ratings need `aria-label="Rated 4 of 5"`.
- Swatches/pills are radio groups (`role="radiogroup"`).
- Icon-only buttons (wishlist, search, account, remove) need `aria-label`.
- Maintain visible focus rings (`focus-visible:ring-2 ring-ink`).
