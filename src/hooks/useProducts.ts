import { useQuery } from "@tanstack/react-query";
import { storeApi } from "../lib/storeApi";
import type { Product } from "../types/product";

export function useProducts(params: Record<string, string | number> = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => storeApi.getProducts(params) as Promise<Product[]>,
  });
}
