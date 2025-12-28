'use client';

import { Home, Grid, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';

export function BottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const cartItems = useCartStore((state) => state.items);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const { language } = useLanguageStore();
    const t = translations[language];

    const navItems = [
        { label: t.home, icon: Home, href: '/' },
        { label: t.menu, icon: Grid, href: '/menu' },
        { label: t.cart, icon: ShoppingCart, href: '/cart', badge: cartCount },
        { label: t.account, icon: User, href: '/account' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] pb-safe">
            <div className="flex items-center justify-around h-16 relative">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 relative z-10",
                                isActive ? "text-crab-red" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 w-12 h-12 m-auto bg-orange-50 rounded-2xl -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative">
                                <item.icon className={cn("w-6 h-6 transition-transform duration-200", isActive && "scale-110")} />
                                {item.badge ? (
                                    <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-crab-red px-1 text-[10px] font-bold text-white ring-2 ring-white">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
