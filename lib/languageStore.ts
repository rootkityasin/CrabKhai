import { create } from 'zustand';

type Language = 'en' | 'bn';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'en',
    setLanguage: (lang) => set({ language: lang }),
    toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'bn' : 'en' })),
}));
