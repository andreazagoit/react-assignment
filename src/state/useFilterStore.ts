import { create } from "zustand";
import { Category } from "../types";

interface FilterState {
  search: string;
  activeCategory: Category;
  setSearch: (value: string) => void;
  setCategory: (category: Category) => void;
}

// Create global variables for filters
const useFilterStore = create<FilterState>((set) => ({
  search: "",
  activeCategory: undefined,
  setSearch: (value) =>
    set((state) => {
      return {
        ...state,
        search: value,
      };
    }),
  setCategory: (category: Category) =>
    set((state) => {
      return {
        ...state,
        activeCategory: category,
      };
    }),
}));

export default useFilterStore;
