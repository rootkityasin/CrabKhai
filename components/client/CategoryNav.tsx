'use client';

import { Utensils, Flame, Fish, Award, Star, Sparkles, TrendingUp, Zap, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';
import { getCategories } from '@/app/actions/category';
import { useState, useEffect } from 'react';

const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();

    if (n.includes('live')) return Fish;
    if (n.includes('crab') && n.includes('masala')) return Flame;
    if (n.includes('spicy') || n.includes('bomb')) return Flame;
    if (n.includes('platter') || n.includes('combo')) return Utensils;
    if (n.includes('side') || n.includes('rice') || n.includes('bread')) return Star;
    if (n.includes('fry') || n.includes('fried')) return Award;
    if (n.includes('best') || n.includes('seller')) return TrendingUp;
    if (n.includes('new') || n.includes('arrival')) return Sparkles;
    if (n.includes('save') || n.includes('deal')) return Zap;

    return Utensils; // default
};

const getCategoryColor = (index: number) => {
    const colors = ['bg-orange-50', 'bg-yellow-50', 'bg-red-50', 'bg-orange-100', 'bg-green-50', 'bg-blue-50'];
    return colors[index % colors.length];
};

interface NavItem {
    id: string;
    name: string;
    icon: any;
    color: string;
}

export function CategoryNav() {
    const { language } = useLanguageStore();
    const t = translations[language];
    const [items, setItems] = useState<NavItem[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const cData = await getCategories();
            const navItems: NavItem[] = [];

            if (cData && cData.length > 0) {
                cData.forEach((c: any, index: number) => {
                    navItems.push({
                        id: c.id,
                        name: c.name,
                        icon: getCategoryIcon(c.name),
                        color: getCategoryColor(index)
                    });
                });
            }
            setItems(navItems);
        };
        loadData();
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="py-4 md:py-8 border-b md:border-none border-gray-100">
            <h2 className={`px-4 md:px-0 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-6 ${language !== 'en' ? 'font-bangla' : 'font-body'}`}>
                {t.shopByCategory}
            </h2>

            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden flex gap-4 overflow-x-auto px-4 pb-2 snap-x hide-scrollbar">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/menu?category=${item.id}`}
                        className="snap-start flex flex-col items-center flex-none gap-2 group"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            whileTap={{ scale: 0.9 }}
                            className={cn(
                                "flex items-center justify-center w-16 h-16 rounded-full border shadow-sm transition-colors",
                                "bg-gray-50 border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-200"
                            )}
                        >
                            <item.icon className={cn("w-7 h-7 transition-colors", "text-gray-600 group-hover:text-orange-600")} />
                        </motion.div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${language !== 'en' ? 'font-bangla' : 'font-body'} text-gray-600 group-hover:text-orange-600`}>
                            {(t.categories as any)?.[item.name] || item.name}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Desktop: Grid with Glassmorphism */}
            <div className="hidden md:grid grid-cols-5 gap-6">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/menu?category=${item.id}`}
                        className="group relative"
                    >
                        <motion.div
                            whileHover={{ y: -5 }}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-orange-500/10 hover:shadow-xl transition-all duration-300 h-full"
                            )}
                        >
                            <div className={cn("p-4 rounded-full mb-4 transition-colors duration-300", item.color, "group-hover:bg-white")}>
                                <item.icon className={cn("w-8 h-8 transition-colors", "text-slate-700 group-hover:text-crab-red")} />
                            </div>
                            <span className={cn(
                                "text-sm font-bold uppercase tracking-wide transition-colors",
                                language !== 'en' ? 'font-bangla' : 'font-body',
                                "text-slate-700 group-hover:text-crab-red"
                            )}>
                                {(t.categories as any)?.[item.name] || item.name}
                            </span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
