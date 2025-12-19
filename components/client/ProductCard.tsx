'use client';

import { useState } from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

export function ProductCard({ product }: { product: Product }) {
    const [qty, setQty] = useState(0);
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = () => {
        setQty(1);
        addItem({ ...product, quantity: 1, modifiers: 'Standard' });
    };

    return (
        <div className="relative flex-none w-48 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden snap-start flex flex-col group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Image Area */}
            <div className="relative h-32 w-full bg-gray-50 overflow-hidden">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-2 left-2 bg-crab-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    FRESH
                </div>
            </div>

            {/* Content Area */}
            <div className="p-3 flex flex-col flex-1 relative">
                <h3 className="text-sm font-heading font-bold text-ocean-blue line-clamp-2 leading-tight mb-1 h-9">{product.name}</h3>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-crab-red">৳{product.price}</span>
                    {qty === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-sand/30 text-crab-red border border-sand shadow-sm active:scale-95 transition-all hover:bg-crab-red hover:text-white hover:border-crab-red"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-1.5 py-0.5 shadow-sm">
                            <button className="text-gray-400 hover:text-crab-red transition-colors" onClick={() => setQty(Math.max(0, qty - 1))}><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-bold w-4 text-center">{qty}</span>
                            <button className="text-crab-red hover:text-crab-red/80 transition-colors" onClick={() => setQty(qty + 1)}><Plus className="w-3 h-3" /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
