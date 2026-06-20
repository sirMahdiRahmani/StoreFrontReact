import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={Math.min(i, 7) * 60}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
