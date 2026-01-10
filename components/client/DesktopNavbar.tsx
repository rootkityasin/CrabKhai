'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';
import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/components/providers/AdminProvider';
import { getSiteConfig } from '@/app/actions/settings'; // Kept types
import { cn } from '@/lib/utils';
import { menuItems } from '@/lib/data';

import { AnimatedSearchBar } from './AnimatedSearchBar';

// Reusing the Mobile Sidebar logic but adapted for Desktop if needed overlap
import { MobileHeader } from './MobileHeader'; // We might not want to import the whole header just for sidebar... 
// actually, let's just duplicate the sidebar overlay for now or create a shared one later.
// For speed: simple overlay sidebar.

export function DesktopNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const { settings } = useAdmin(); // Use shared settings
    const config = settings;

    const cartItems = useCartStore((state) => state.items);
    const openCart = useCartStore((state) => state.openCart); // Get action
    const { language, toggleLanguage } = useLanguageStore();
    const t = translations[language];
    const [mounted, setMounted] = useState(false);



    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        // getSiteConfig removed - using Context

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const navItems = [
        { label: t.home, href: '/' },
        { label: t.menu, href: '/menu' },
        { label: 'Story', href: '/story' },
    ];





    const isHomePage = pathname === '/';
    const isTransparent = isHomePage && !scrolled;

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block",
                    !isTransparent
                        ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Hamburger (Desktop) */}
                        <button
                            className={cn(
                                "p-2 -ml-2 rounded-full transition-colors",
                                !isTransparent ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/10"
                            )}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" x2="21" y1="6" y2="6" />
                                <line x1="3" x2="21" y1="12" y2="12" />
                                <line x1="3" x2="21" y1="18" y2="18" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src={config?.logoUrl || "/logo.svg"}
                                alt={config?.shopName || "CrabKhai"}
                                className={cn(
                                    "w-auto object-contain transition-all duration-300 group-hover:scale-105",
                                    !isTransparent ? "h-14" : "h-20"
                                )}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/logo.svg";
                                }}
                            />
                        </Link>
                    </div>

                    {/* Center Nav */}
                    <nav className="flex items-center gap-8 bg-black/5 backdrop-blur-sm px-8 py-2.5 rounded-full border border-white/10 shadow-sm">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-bold tracking-wide uppercase transition-colors relative",
                                        isActive
                                            ? "text-crab-red"
                                            : !isTransparent ? "text-slate-700 hover:text-crab-red" : "text-white hover:text-crab-red" // Text color adapts to bg
                                    )}
                                >
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="desktop-nav-underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-crab-red rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-5">
                        {/* Search */}
                        <AnimatedSearchBar width="w-72" />

                        {/* Language */}
                        <button
                            onClick={toggleLanguage}
                            className={cn(
                                "text-xs font-bold px-2 py-1 rounded border transition-colors",
                                language !== 'en' ? 'font-bangla' : 'font-body',
                                !isTransparent
                                    ? "border-slate-200 text-slate-600 hover:border-crab-red hover:text-crab-red"
                                    : "border-white/30 text-white hover:bg-white/10"
                            )}
                        >
                            {language === 'en' ? 'EN' : language === 'bn' ? 'বাংলা' : language.toUpperCase()}
                        </button>

                        {/* Cart */}
                        <button onClick={openCart} className="relative group">
                            <div className={cn(
                                "p-2 rounded-full transition-colors",
                                !isTransparent ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
                            )}>
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-crab-red text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* Account */}
                        <Link href="/account">
                            <div className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                                !isTransparent
                                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10"
                            )}>
                                <User className="w-4 h-4" />
                                <span className="text-xs font-bold">Account</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar Overlay - Similar content to mobile, but styled for desktop context if needed */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-slate-950 z-[70] shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-white font-bold text-xl uppercase tracking-widest">Menu</span>
                                <button onClick={() => setIsSidebarOpen(false)} className="text-white/70 hover:text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                </button>
                            </div>
                            <nav className="space-y-6">
                                {[
                                    { href: "/", label: "HOME", color: "text-white" },
                                    { href: "/menu", label: "MENU", color: "text-white" },
                                    { href: "/story", label: "OUR STORY", color: "text-crab-red" },
                                    { href: "/account", label: "ACCOUNT", color: "text-white" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.1) }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`block text-2xl font-black hover:text-crab-red transition-colors ${item.color}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mt-auto pt-8 border-t border-white/10">
                                <p className="text-white/40 text-sm">© {new Date().getFullYear()} {config?.shopName || "CrabKhai"}</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
