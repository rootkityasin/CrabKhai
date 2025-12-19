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
        <div className="relative flex-none w-44 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden snap-start flex flex-col group transition-all duration-300 hover:shadow-md">
            {/* Image Area */}
            <div className="relative h-28 w-full bg-gray-50">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    NEW
                </div>
            </div>

            {/* Content Area */}
            <div className="p-3 flex flex-col flex-1 relative">
                <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-auto h-8">{product.name}</h3>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-600">৳{product.price}</span>
                    {qty === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="flex items-center justify-center w-7 h-7 rounded bg-orange-50 text-orange-600 border border-orange-100 shadow-sm active:scale-95 transition-all hover:bg-orange-600 hover:text-white hover:border-orange-600"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-1 py-0.5 shadow-sm">
                            <button className="text-gray-400 hover:text-orange-600" onClick={() => setQty(Math.max(0, qty - 1))}><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button className="text-orange-600 hover:text-orange-700" onClick={() => setQty(qty + 1)}><Plus className="w-3 h-3" /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
