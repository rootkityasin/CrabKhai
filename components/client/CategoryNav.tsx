'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/app/actions/category';
import { cn } from '@/lib/utils';
import {
    Fish,
    Flame,
    Utensils,
    Drumstick,
    Soup,
    Shell,
    ShoppingBag
} from 'lucide-react';

const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('live')) return Fish;
    if (n.includes('crab') && n.includes('masala')) return Flame;
    if (n.includes('meat')) return Shell;
    if (n.includes('ready')) return Utensils;
    if (n.includes('fry') || n.includes('fried')) return Drumstick;
    if (n.includes('soup')) return Soup;
    return Utensils;
};

export function CategoryNav() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const cats = await getCategories();
            setCategories(cats);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-20" />;

    return (
        <div className="py-4 md:py-8 container mx-auto px-4 md:px-0">
            {/* Mobile View: Horizontal Scroll */}
            <div className="md:hidden flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {/* Categories Only */}
                {categories.map((cat) => {
                    const Icon = getCategoryIcon(cat.name);
                    return (
                        <Link
                            key={cat.id}
                            href={`/menu?category=${cat.id}`}
                            className="flex flex-col items-center gap-2 min-w-[80px]"
                        >
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100">
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-center leading-tight line-clamp-2 w-full">
                                {cat.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden md:grid grid-cols-5 lg:grid-cols-6 gap-4">
                {/* Categories Only */}
                {categories.map((cat) => {
                    const Icon = getCategoryIcon(cat.name);
                    return (
                        <Link
                            key={cat.id}
                            href={`/menu?category=${cat.id}`}
                            className="group flex flex-col items-center justify-center p-6 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white hover:border-slate-200 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <div className="mb-3 p-3 rounded-full bg-slate-100 text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-200 transition-colors">
                                <Icon className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 text-center">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
