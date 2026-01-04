'use client';

import { Utensils, Flame, Fish, Award, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';

const categories = [
    { id: '1', name: 'Live Crab', icon: Fish, color: 'bg-orange-50' },
    { id: '2', name: 'Platters', icon: Utensils, color: 'bg-yellow-50' },
    { id: '3', name: 'Best Sellers', icon: Award, color: 'bg-red-50' },
    { id: '4', name: 'Spicy', icon: Flame, color: 'bg-orange-100' },
    { id: '5', name: 'Sides', icon: Star, color: 'bg-green-50' },
];

export function CategoryNav() {
    const { language } = useLanguageStore();
    const t = translations[language];

    return (
        <div className="py-4 bg-white border-b border-gray-100">
            <h2 className={`px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ${language !== 'en' ? 'font-bangla' : 'font-body'}`}>
                {t.shopByCategory}
            </h2>
            <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x hide-scrollbar">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/menu?category=${cat.id}`} className="snap-start flex flex-col items-center flex-none gap-2 group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            whileTap={{ scale: 0.9 }}
                            transition={{
                                scale: { type: "spring", stiffness: 400, damping: 10 },
                                rotate: { duration: 0.5, ease: "easeInOut" }
                            }}
                            className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 border border-gray-100 shadow-sm transition-colors group-hover:border-orange-200 group-hover:bg-orange-50"
                        >
                            <cat.icon className="w-7 h-7 text-gray-600 group-hover:text-orange-600 transition-colors" />
                        </motion.div>
                        <span className={`text-[10px] font-bold text-gray-600 uppercase tracking-wide group-hover:text-orange-600 transition-colors ${language !== 'en' ? 'font-bangla' : 'font-body'}`}>
                            {t.categories[cat.name as keyof typeof t.categories]}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
