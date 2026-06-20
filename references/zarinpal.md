# Zarinpal checkout flow

Zarinpal is redirect-based — there is no in-page card form. End-to-end flow:

1. Build/validate the cart via the Store API (`Cart-Token`).
2. Collect billing/shipping in React (`src/routes/Checkout.tsx`). Send them
   to the BFF (`VITE_BFF_PAYMENT_URL`), not to WooCommerce directly.
3. BFF creates the WooCommerce order in `pending` status (via Store API
   checkout with a manual/pending gateway, or via `wc/v3`). Records the
   order id and **server-computed** total.
4. BFF calls Zarinpal `payment/request` with the order total → gets an
   `Authority`.
5. BFF returns the `StartPay` URL; the React app redirects the browser
   there (`window.location.href = redirectUrl` — see `useCheckout`/
   `createPayment` in `src/lib/storeApi.ts`).
6. User pays; Zarinpal redirects back to our `callback_url` with
   `Authority` and `Status` query params.
7. BFF verifies with Zarinpal `payment/verify` (amount must match the
   amount sent in step 4). On success, BFF updates the WooCommerce order to
   `processing`/`completed` via `wc/v3` and the frontend shows the success
   state; on failure, the order is marked `failed` and the user can retry
   (cart must survive untouched — see `PaymentResult.tsx`).

## Non-negotiable gotchas (backend/BFF responsibility)

- **Currency:** Zarinpal amounts default to Rial (IRR). If the store works
  in Toman, either send `currency: "IRT"` or convert (1 Toman = 10 Rial).
  Getting this wrong over/undercharges by 10×. The amount sent to `verify`
  MUST equal the amount sent to `request`.
- **Idempotency:** the callback may be hit twice (refresh). `verify` is
  safe to call again — code `101` means "already verified." Never
  double-fulfill the order.
- **Server-trusted total:** compute the order total from the WooCommerce
  order on the server, never from a number posted by the browser.
- **RTL/Persian:** Persian digits and `dir="rtl"` are presentation only —
  amounts in API payloads stay Latin integers; format for display
  separately (`src/lib/format.ts`).
- Verify exact request/response field names against current WooCommerce and
  Zarinpal docs before implementing the BFF — this file describes the flow
  shape, not a frozen contract.

## Frontend contract (`src/lib/storeApi.ts: createPayment`)

```
POST VITE_BFF_PAYMENT_URL
  Cart-Token: <token>
  body: { firstName, lastName, phone, email, address, city, postalCode, note? }
  -> { redirectUrl: string }   // Zarinpal StartPay URL
```

The result page (`/payment-result?status=success|failed|verifying&order=...&ref_id=...`)
is where Zarinpal's callback should land the user after the BFF's own
verify step completes.
