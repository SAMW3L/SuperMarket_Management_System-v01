import { create } from 'zustand';
import { Sale, SaleItem } from '../types';

interface CartItem extends SaleItem {
  name: string;
}

interface SalesState {
  cart: CartItem[];
  sales: Sale[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addSale: (sale: Sale) => void;
}

export const useSalesStore = create<SalesState>((set) => ({
  cart: [],
  sales: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.productId === item.productId);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  updateCartItem: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    })),
  clearCart: () => set({ cart: [] }),
  addSale: (sale) =>
    set((state) => ({
      sales: [sale, ...state.sales],
    })),
}));