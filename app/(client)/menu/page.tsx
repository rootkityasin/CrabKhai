'use client';

import { ProductCard } from '@/components/client/ProductCard';
import { Search } from 'lucide-react';

// Scraped Data from crabkhaibd.com
const menuItems = [
    {
        "id": "101",
        "name": "Crispy Crab Wings",
        "price": "330",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/604194297355933.png"
    },
    {
        "id": "102",
        "name": "Crispy Crab Bomb",
        "price": "330",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/606088101401451.png"
    },
    {
        "id": "103",
        "name": "Signature Masala Crab wings",
        "price": "350",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/651903648889884.png"
    },
    {
        "id": "104",
        "name": "Tempura Shrimp",
        "price": "400",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/745402355963125.png"
    },
    {
        "id": "105",
        "name": "WINGS & BOMB COMBO",
        "price": "BDT 1200",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/4838007732246716.jpg"
    },
    {
        "id": "106",
        "name": "Raw Crab Clean",
        "price": "450",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/587600975137614.png"
    },
    {
        "id": "107",
        "name": "Signature Masala Crab Bomb",
        "price": "350",
        "image": "https://www.easykoro.com/inventories/fit-in/400x400/1684482693291279.png"
    }
];

export default function MenuPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 py-3 shadow-sm">
                <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Full Menu</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for crabs..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-crab-red/20"
                    />
                </div>
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>

            <div className="text-center py-8 text-gray-400 text-sm">
                ~ End of Menu ~
            </div>
        </div>
    );
}
