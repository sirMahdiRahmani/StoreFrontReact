import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storeApi } from "../lib/storeApi";
import { useCartStore, type CartItem, type CartTotals } from "../store/cartStore";

interface CartResponse {
  items: CartItem[];
  totals: CartTotals;
}

const CART_KEY = ["cart"];

export function useCart() {
  const setFromServerResponse = useCartStore((s) => s.setFromServerResponse);

  return useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const cart = (await storeApi.getCart()) as CartResponse;
      setFromServerResponse(cart);
      return cart;
    },
  });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  const setFromServerResponse = useCartStore((s) => s.setFromServerResponse);

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      storeApi.addCartItem(id, quantity) as Promise<CartResponse>,
    onSuccess: (cart) => {
      setFromServerResponse(cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const setFromServerResponse = useCartStore((s) => s.setFromServerResponse);

  return useMutation({
    mutationFn: ({ key, quantity }: { key: string; quantity: number }) =>
      storeApi.updateCartItem(key, quantity) as Promise<CartResponse>,
    onSuccess: (cart) => {
      setFromServerResponse(cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const setFromServerResponse = useCartStore((s) => s.setFromServerResponse);

  return useMutation({
    mutationFn: (key: string) => storeApi.removeCartItem(key) as Promise<CartResponse>,
    onSuccess: (cart) => {
      setFromServerResponse(cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  const setFromServerResponse = useCartStore((s) => s.setFromServerResponse);

  return useMutation({
    mutationFn: (code: string) => storeApi.applyCoupon(code) as Promise<CartResponse>,
    onSuccess: (cart) => {
      setFromServerResponse(cart);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}
