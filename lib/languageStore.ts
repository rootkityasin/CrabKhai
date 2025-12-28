import { create } from 'zustand';

type Language = 'en' | 'bn' | 'ctg' | 'noa';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'en',
    setLanguage: (lang) => set({ language: lang }),
    toggleLanguage: () => set((state) => {
        const order: Language[] = ['en', 'bn', 'ctg', 'noa'];
        const currentIndex = order.indexOf(state.language);
        const nextIndex = (currentIndex + 1) % order.length;
        return { language: order[nextIndex] };
    }),
}));
