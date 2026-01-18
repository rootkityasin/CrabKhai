'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCategories } from '@/app/actions/category';
import {
    Fish,
    Flame,
    Utensils,
    Drumstick,
    Soup,
    Shell,
    ChevronRight,
    Sparkles
} from 'lucide-react';

const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('live')) return Fish;
    if (n.includes('masala')) return Flame;
    if (n.includes('meat')) return Shell;
    if (n.includes('ready')) return Utensils;
    if (n.includes('fry') || n.includes('fried')) return Drumstick;
    if (n.includes('soup')) return Soup;
    return Utensils;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cardVariants: any = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.8,
        rotateX: -15
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 12,
            mass: 1
        }
    }
};

export function CategoryNav({ initialCategories = [] }: { initialCategories?: any[] }) {
    const categories = initialCategories;

    return (
        <section className="relative py-8 md:py-16 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-crab-red/5 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/5 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-crab-red to-orange-600">Categories</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="hidden md:block"
                    >
                        <p className="text-slate-500 font-medium max-w-xs text-right text-sm leading-relaxed">
                            Explore our wide range of fresh, high-quality seafood and premium ready-to-fry products.
                        </p>
                    </motion.div>
                </div>

                {/* Mobile View: Horizontal Scroll */}
                <div className="md:hidden flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 snap-x">
                    {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.name);
                        return (
                            <Link
                                key={cat.id}
                                href={`/menu?category=${cat.id}`}
                                className="flex flex-col items-center gap-3 min-w-[100px] snap-center group"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-center text-slate-600 group-active:scale-95 transition-all">
                                        <Icon className="w-8 h-8 group-active:text-crab-red transition-colors" />
                                    </div>
                                    <div className="absolute inset-0 bg-crab-red opacity-0 group-active:opacity-5 rounded-2xl transition-opacity" />
                                </div>
                                <span className="text-xs font-black text-center text-slate-800 uppercase tracking-wider line-clamp-2 w-full px-1">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop View: Premium Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    {categories.map((cat) => {
                        const Icon = getCategoryIcon(cat.name);
                        return (
                            <motion.div
                                key={cat.id}
                                variants={cardVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={`/menu?category=${cat.id}`}
                                    className="group relative block h-full"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-crab-red/10 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl blur-2xl transition-opacity duration-500" />

                                    <div className="relative h-full flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(230,0,0,0.08)] group-hover:-translate-y-3 group-hover:bg-white/90 transition-all duration-500 overflow-hidden">

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="mb-6 p-5 rounded-2xl bg-slate-50 text-slate-400 group-hover:text-white group-hover:bg-crab-red shadow-inner transition-all duration-500 transform group-hover:rotate-[10deg]">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 group-hover:text-crab-red text-center uppercase tracking-widest transition-colors duration-300">
                                                {cat.name}
                                            </h3>
                                        </div>

                                        {/* Arrow Indicator */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                            <ChevronRight className="w-5 h-5 text-crab-red" />
                                        </div>

                                        {/* Bottom Accent */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-crab-red group-hover:w-full transition-all duration-500" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
