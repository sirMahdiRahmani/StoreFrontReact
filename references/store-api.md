# WooCommerce Store API — Cart-Token mechanics

The Store API (`/wp-json/wc/store/v1/`) is public, frontend-facing, cart-aware,
and requires no consumer keys. This is what the browser uses directly for
products, cart, and checkout. The Admin REST API (`/wp-json/wc/v3/`) is a
separate, server-to-server, key-authenticated API with no cart concept — it
is only ever called from the BFF (e.g. to flip an order to `processing`
after payment verification). Never call `wc/v3` or hold its consumer
key/secret in browser code.

## Guest cart: the Cart-Token rule

Headless carts that rely on cookies break cross-domain ("add an item, then
it's empty on the next request"). The fix:

1. The first cart call (`GET /wc/store/v1/cart`) returns a `Cart-Token`
   response header. Capture it.
2. Persist it (Zustand store + localStorage — see `src/store/cartStore.ts`)
   and send it back as the `Cart-Token` request header on every subsequent
   cart/checkout call.
3. With a `Cart-Token` you do not need a nonce — one or the other, not both.

This gives a stable guest cart with no login, implemented in
`src/lib/storeApi.ts`.

## Endpoints used by this app

- `GET /products` — listing/search/sort.
- `GET /products?slug=...` — product detail.
- `GET /cart` — current cart (items + server-computed totals).
- `POST /cart/add-item` — `{ id, quantity }`.
- `POST /cart/update-item` — `{ key, quantity }`.
- `POST /cart/remove-item` — `{ key }`.
- `POST /cart/apply-coupon` — `{ code }`.

Cart totals (`/cart` response `totals`) are always read from the server and
rendered as-is — the client never recomputes subtotal/total/shipping.

## CORS

The Store API does not send `Access-Control-Allow-Origin` for arbitrary
origins by default, so calling it directly from a different dev/prod
origin gets blocked by the browser.

- **Dev:** `vite.config.ts` proxies `/wc-api/*` to `VITE_STORE_API_URL`'s
  origin, and `src/lib/storeApi.ts` routes through it automatically when
  `import.meta.env.DEV` — the browser only ever calls same-origin
  `localhost`, so no CORS headers are needed locally.
- **Prod:** the proxy doesn't exist; the WordPress host must explicitly
  allow the deployed frontend's origin, e.g. via `functions.php`:
  ```php
  add_filter('rest_pre_serve_request', function ($served) {
      header('Access-Control-Allow-Origin: https://your-frontend-domain.com');
      header('Access-Control-Allow-Methods: GET, POST');
      header('Access-Control-Allow-Headers: Content-Type, Cart-Token');
      header('Access-Control-Expose-Headers: Cart-Token');
      return $served;
  });
  ```

## Checkout

Billing/shipping fields are collected client-side and sent to the BFF (not
directly to `wc/v3`). The BFF is responsible for creating the WooCommerce
order (pending) and returning a payment redirect URL — see
`references/zarinpal.md`.
