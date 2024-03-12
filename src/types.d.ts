// Create a global file for common types

import { categories } from "./assets/data/categories";

export type Category = undefined | (typeof categories)[number];

export type ProductWithQuantity = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: ProductWithQuantity[];
  totalPrice: number;
  totalItems: number;
  loading: boolean;
};

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};
