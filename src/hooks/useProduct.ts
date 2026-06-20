import { useQuery } from "@tanstack/react-query";
import { storeApi } from "../lib/storeApi";
import type { Product } from "../types/product";

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => storeApi.getProduct(slug!) as Promise<Product>,
    enabled: !!slug,
  });
}
