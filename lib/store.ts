import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    quantity: number;
    image?: string;
    modifiers?: string; // e.g., "Spice: Naga"
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (i) => i.id === item.id && i.modifiers === item.modifiers
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id && i.modifiers === item.modifiers
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                            isOpen: true, // Auto open on add? Maybe. Let's do it for "premium" feel.
                        };
                    }
                    return { items: [...state.items, item], isOpen: true };
                }),
            removeItem: (itemId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== itemId),
                })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'crabkhai-cart',
            partialize: (state) => ({ items: state.items }), // Only persist items!, don't persist isOpen
        }
    )
);
