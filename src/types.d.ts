// Create a global file for common types

import { categories } from "./assets/data/categories";

export type Category = undefined | (typeof categories)[number];

export type Cart = {
  items: Product[];
  totalPrice: number;
  totalItems: number;
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
