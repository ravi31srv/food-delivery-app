import { create } from "zustand";
import { CartItem, MenuItem } from "@/types";

interface CartStore {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (item) => {
    const existing = get().cart.find((c) => c.item._id === item._id);
    if (existing) {
      set({
        cart: get().cart.map((c) =>
          c.item._id === item._id ? { ...c, qty: c.qty + 1 } : c
        ),
      });
    } else {
      set({ cart: [...get().cart, { item, qty: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter((c) => c.item._id !== id) });
  },

  updateQty: (id, qty) => {
    if (qty <= 0) {
      get().removeFromCart(id);
      return;
    }
    set({
      cart: get().cart.map((c) =>
        c.item._id === id ? { ...c, qty } : c
      ),
    });
  },

  clearCart: () => set({ cart: [] }),

  totalItems: () => get().cart.reduce((sum, c) => sum + c.qty, 0),

  totalPrice: () =>
    get().cart.reduce((sum, c) => sum + c.item.price * c.qty, 0),
}));