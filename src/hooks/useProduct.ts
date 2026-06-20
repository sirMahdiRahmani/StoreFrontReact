import { useQuery } from "@tanstack/react-query";
import { storeApi } from "../lib/storeApi";
import type { Product } from "../types/product";

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => storeApi.getProduct(id!) as Promise<Product>,
    enabled: !!id,
  });
}
