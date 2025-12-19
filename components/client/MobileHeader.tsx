'use client';

import { Menu, Search, MapPin, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

export function MobileHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-[#1e293b] border-b border-gray-800 shadow-md">
            <div className="flex items-center justify-between px-4 h-16 text-white">
                {/* Left: Logo Area */}
                <div className="flex items-center gap-3">
                    <button className="p-1 -ml-1 text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.svg" alt="CrabKhai" className="h-14 w-auto" />
                    </Link>
                </div>

                {/* Right: Icons (Search, Pin, Cart, User) */}
                <div className="flex items-center gap-3">
                    <button className="p-1 text-white">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-white">
                        <MapPin className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-white relative">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">2</span>
                    </button>
                    <button className="p-1 text-white">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
