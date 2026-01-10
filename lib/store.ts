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

    coupon: { code: string; type: 'PERCENTAGE' | 'FIXED'; value: number } | null;
    applyCoupon: (coupon: { code: string; type: 'PERCENTAGE' | 'FIXED'; value: number }) => void;
    removeCoupon: () => void;

    total: () => number; // Item Subtotal
    discount: () => number; // Calculated discount
    finalTotal: () => number; // Payable amount
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            coupon: null,
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
                            isOpen: true,
                        };
                    }
                    return { items: [...state.items, item], isOpen: true };
                }),
            removeItem: (itemId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== itemId),
                })),
            clearCart: () => set({ items: [], coupon: null }),
            total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

            applyCoupon: (coupon) => set({ coupon }),
            removeCoupon: () => set({ coupon: null }),

            discount: () => {
                const { coupon, total } = get();
                if (!coupon) return 0;

                const subTotal = total();
                if (coupon.type === 'PERCENTAGE') {
                    return Math.floor((subTotal * coupon.value) / 100);
                } else {
                    return Math.min(coupon.value, subTotal);
                }
            },

            finalTotal: () => {
                const total = get().total(); // This uses the getter from inside the object specifically? No, get().total() works
                const discount = get().discount();
                return Math.max(0, total - discount);
            }
        }),
        {
            name: 'crabkhai-cart',
            partialize: (state) => ({ items: state.items, coupon: state.coupon }),
        }
    )
);
