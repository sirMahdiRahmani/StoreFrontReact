/** Shape mirrors the relevant fields of the WooCommerce Store API product object. */
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description?: string;
  description?: string;
  sku?: string;
  is_in_stock: boolean;
  categories?: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;
  };
  average_rating?: string;
  review_count?: number;
}
