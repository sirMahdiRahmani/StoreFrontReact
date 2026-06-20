import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  image?: string;
  /** Line/item totals in minor units (matches Store API "totals" shape). */
  totals: {
    line_total: string;
    line_subtotal: string;
  };
}

export interface CartTotals {
  total_items: string;
  total_price: string;
  total_shipping?: string;
}

interface CartState {
  cartToken: string | null;
  items: CartItem[];
  totals: CartTotals | null;
  setCartToken: (token: string) => void;
  /** Replace local cart state from a Store API cart response — server is the
   *  only source of truth for items/totals, never computed on the client. */
  setFromServerResponse: (cart: { items: CartItem[]; totals: CartTotals }) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartToken: null,
      items: [],
      totals: null,
      setCartToken: (token) => set({ cartToken: token }),
      setFromServerResponse: (cart) => set({ items: cart.items, totals: cart.totals }),
      clear: () => set({ items: [], totals: null }),
    }),
    { name: "mellora-cart" },
  ),
);
