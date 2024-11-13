import { create } from 'zustand';
import { Product } from '../types';

interface InventoryState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  bulkAddProducts: (products: Omit<Product, 'id'>[]) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...product, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...updatedProduct, id } : product
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  bulkAddProducts: (newProducts) =>
    set((state) => ({
      products: [
        ...state.products,
        ...newProducts.map((product) => ({
          ...product,
          id: Math.random().toString(36).substr(2, 9),
        })),
      ],
    })),
}));