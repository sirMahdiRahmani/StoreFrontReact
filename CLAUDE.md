# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (localhost:5173)
npm run build     # tsc -b && vite build — type-checks then builds
npm run lint      # eslint .
npx tsc --noEmit  # type-check only, no build output
```

There is no test runner configured in this repo.

## What this is

Regalia — a headless WooCommerce storefront. Mobile-first, **RTL, Persian
(fa-IR)** only (`<html dir="rtl" lang="fa">` in `index.html`). Guest-only
checkout (no accounts/login anywhere), paid via Zarinpal (Iranian redirect
gateway). Built on Vite + React 19 + TypeScript + Tailwind v4 + TanStack
Query + Zustand + react-router-dom.

The design spec and source-of-truth tokens live in `design_handoff/` —
`FRONTEND_SPEC_FA_RTL.md` lists the 13 target screens and RTL rules;
`tokens.css` defines the canonical `--*` CSS custom properties (light/dark
theme, brand/gilt palette) that `src/styles/tokens.css` mirrors and Tailwind
colors are driven from. Don't invent new colors outside these tokens.

## Architecture

**Two backends, two different trust levels** — see `references/store-api.md`
and `references/zarinpal.md` for the full contracts:

- **WooCommerce Store API** (`/wp-json/wc/store/v1/`) — public, cart-aware,
  no auth. The browser calls this directly through `src/lib/storeApi.ts`.
  Guest carts work via a `Cart-Token` response header that must be captured
  and replayed on every subsequent request (not cookies — those break
  cross-origin). The token is persisted in `src/store/cartStore.ts`
  (Zustand + localStorage, key `regalia-cart`).
- **BFF** (`VITE_BFF_PAYMENT_URL`) — a separate backend, not WooCommerce's
  admin API. It creates the pending WooCommerce order, talks to Zarinpal
  (`payment/request` / `payment/verify`), and only it ever holds
  Zarinpal/WooCommerce admin credentials. The frontend never calls
  `wc/v3` or holds merchant keys. `createPayment()` in `storeApi.ts` is the
  only frontend entry point into the BFF.

**Server is the only source of truth for money.** Cart totals and line
prices always come from the Store API `totals` response and are rendered
as-is in `src/store/cartStore.ts` / `useCart` — the client never
recomputes subtotal/shipping/total itself.

**Data flow:** routes (`src/routes/*`) call hooks (`src/hooks/*`), which
wrap `storeApi` calls in TanStack Query (`useQuery`/`useMutation`) and push
server responses into the Zustand cart store via
`setFromServerResponse`. There is one shared `QueryClient` instantiated in
`src/App.tsx`.

**Dev-only CORS proxy:** the Store API doesn't send CORS headers for
arbitrary origins. `vite.config.ts` proxies `/wc-api/*` to
`VITE_STORE_API_URL`'s origin, and `storeApi.ts` routes through that proxy
path automatically when `import.meta.env.DEV`; production builds call the
configured URL directly and require the WordPress host to allow that
origin (snippet in `references/store-api.md`).

## RTL / Persian conventions (non-negotiable)

- **Never use physical Tailwind utilities** (`left-*`/`right-*`,
  `ml-*`/`mr-*`, `pl-*`/`pr-*`, `text-left`/`text-right`, `rounded-l/-r`,
  `border-l/-r`). Always use logical equivalents (`start-*`/`end-*`,
  `ms-*`/`me-*`, `ps-*`/`pe-*`, `text-start`/`text-end`, `rounded-s/-e`,
  `border-s/-e`).
- Directional icons (chevrons, arrows) must flip in RTL —
  `rtl:-scale-x-100` or swap the glyph.
- All user-facing numbers (prices, counts, ratings) render in Persian
  digits via `faDigits`/`toman` in `src/lib/format.ts`. Technical/numeric
  input fields (phone, email, postal code) get `dir="ltr"` even inside the
  RTL page.
- Mobile-first: design baseline is a ~392px phone, scale up with
  `sm`/`lg`/`xl`. Filters are a bottom sheet on mobile, a sidebar at `lg+`
  (see `src/routes/Shop.tsx` + `src/components/FilterPanel.tsx`).

## Payment flow

Checkout → BFF creates pending WooCommerce order + Zarinpal `Authority` →
redirect to Zarinpal → callback → BFF verifies → frontend lands on
`/payment-result` with `success` / `failed` / `verifying` states
(`src/routes/PaymentResult.tsx`). On failure the cart must survive
untouched — never clear cart state until a verified success.
