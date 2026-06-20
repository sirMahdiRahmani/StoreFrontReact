import { useCartStore } from "../store/cartStore";

const STORE_API_URL = import.meta.env.VITE_STORE_API_URL as string | undefined;

// In dev, route through the Vite proxy (see vite.config.ts) so the browser
// calls same-origin localhost — WooCommerce's Store API does not send
// Access-Control-Allow-Origin for arbitrary dev origins. Production builds
// call the Store API directly; the WordPress host must allow that origin.
const BASE_URL =
  import.meta.env.DEV && STORE_API_URL
    ? `/wc-api${new URL(STORE_API_URL).pathname}`
    : STORE_API_URL;
const CART_TOKEN_HEADER = "Cart-Token";

export class StoreApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Thin wrapper around the WooCommerce Store API (/wp-json/wc/store/v1).
 * Persists the guest Cart-Token from response headers and replays it on
 * every subsequent request so the cart survives across calls without login.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!BASE_URL) {
    throw new StoreApiError(
      "VITE_STORE_API_URL is not configured — set it in .env to point at the WooCommerce Store API.",
      0,
    );
  }

  const cartToken = useCartStore.getState().cartToken;
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (cartToken) headers.set(CART_TOKEN_HEADER, cartToken);

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  const nextToken = res.headers.get(CART_TOKEN_HEADER);
  if (nextToken && nextToken !== cartToken) {
    useCartStore.getState().setCartToken(nextToken);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new StoreApiError(body?.message ?? "درخواست به فروشگاه ناموفق بود.", res.status);
  }

  return res.json() as Promise<T>;
}

/**
 * WooCommerce Store API cart write endpoints require either a valid Nonce or a
 * Cart-Token. A fresh guest has neither until the first GET /cart issues a
 * Cart-Token (captured from the response header in `request`). Without it the
 * first write — e.g. "add to cart" straight from a product page — returns
 * 401 woocommerce_rest_missing_nonce. Seed the token first when it's missing.
 */
async function ensureCartToken(): Promise<void> {
  if (useCartStore.getState().cartToken) return;
  await request<unknown>("/cart");
}

export const storeApi = {
  getProducts: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    );
    return request<unknown[]>(`/products?${qs.toString()}`);
  },
  getProduct: (id: string | number) => request<unknown>(`/products/${id}`),
  getCart: () => request<unknown>("/cart"),
  addCartItem: async (id: number, quantity: number) => {
    await ensureCartToken();
    return request<unknown>("/cart/add-item", {
      method: "POST",
      body: JSON.stringify({ id, quantity }),
    });
  },
  updateCartItem: async (key: string, quantity: number) => {
    await ensureCartToken();
    return request<unknown>("/cart/update-item", {
      method: "POST",
      body: JSON.stringify({ key, quantity }),
    });
  },
  removeCartItem: async (key: string) => {
    await ensureCartToken();
    return request<unknown>("/cart/remove-item", {
      method: "POST",
      body: JSON.stringify({ key }),
    });
  },
  applyCoupon: async (code: string) => {
    await ensureCartToken();
    return request<unknown>("/cart/apply-coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
};

/**
 * BFF payment endpoint — NOT the WooCommerce Store API. The backend creates a
 * pending order and returns a Zarinpal redirect URL. No merchant_id or keys
 * ever touch the browser. Contract is assumed generic until a real backend
 * is wired up (see design_handoff plan: flagged for confirmation).
 */
const BFF_PAYMENT_URL = import.meta.env.VITE_BFF_PAYMENT_URL as string | undefined;

export interface CheckoutPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  note?: string;
}

export async function createPayment(payload: CheckoutPayload): Promise<{ redirectUrl: string }> {
  if (!BFF_PAYMENT_URL) {
    throw new StoreApiError(
      "VITE_BFF_PAYMENT_URL is not configured — set it in .env to point at the payment BFF.",
      0,
    );
  }
  const res = await fetch(BFF_PAYMENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [CART_TOKEN_HEADER]: useCartStore.getState().cartToken ?? "",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new StoreApiError("ایجاد پرداخت ناموفق بود.", res.status);
  }
  return res.json();
}
