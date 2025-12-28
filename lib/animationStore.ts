import { create } from 'zustand';

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface FlyItem {
    id: string;
    image: string;
    startRect: Rect;
}

interface AnimationState {
    targetRect: Rect | null;
    flyingItems: FlyItem[];
    setTargetRect: (rect: Rect) => void;
    triggerFly: (image: string, startRect: Rect) => void;
    removeFlyItem: (id: string) => void;
    isDeliveryRunning: boolean;
    triggerDeliveryRun: () => void;
}

export const useAnimationStore = create<AnimationState>((set) => ({
    targetRect: null,
    flyingItems: [],
    isDeliveryRunning: false,
    setTargetRect: (rect) => set({ targetRect: rect }),
    triggerFly: (image, startRect) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            flyingItems: [...state.flyingItems, { id, image, startRect }]
        }));
    },
    removeFlyItem: (id) => set((state) => ({
        flyingItems: state.flyingItems.filter(item => item.id !== id)
    })),
    triggerDeliveryRun: () => {
        set({ isDeliveryRunning: true });
        setTimeout(() => set({ isDeliveryRunning: false }), 8000); // Reset after 8s
    }
}));
