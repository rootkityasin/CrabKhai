'use client';

import { Plus } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { useLanguageStore } from '@/lib/languageStore';

interface ProductCardProps {
    id: string;
    name: string;
    name_bn?: string;
    price: string;
    price_bn?: string;
    image: string;
    categoryId?: string;
}

export function ProductCard({ id, name, name_bn, price, price_bn, image }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { language } = useLanguageStore();

    const displayPrice = language === 'bn' && price_bn ? price_bn : price;
    const displayName = language === 'bn' && name_bn ? name_bn : name;

    const handleAddToCart = () => {
        addItem({ id, name, price: Number(price.replace(/[^0-9.]/g, '')), image, quantity: 1 });
        toast.success(`Added ${name} to cart`);
    };

    return (
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-scale-in hover-scale">
            <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>
            <div className="p-3">
                <h3 className={`font-bold text-gray-800 line-clamp-1 mb-1 ${language === 'bn' ? 'font-bangla text-base' : 'font-heading text-sm'}`}>
                    {displayName}
                </h3>
                <div className="flex items-center justify-between">
                    <span className={`text-crab-red font-bold ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>
                        ৳{displayPrice}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-crab-red transition-colors active:scale-95"
                        aria-label="Add to cart"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
