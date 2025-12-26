'use client';

import { Plus } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { useLanguageStore } from '@/lib/languageStore';
import { useState } from 'react';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
    id: string;
    name: string;
    name_bn?: string;
    price: string;
    price_bn?: string;
    image: string;
    categoryId?: string;
    nutritionImage?: string;
    cookingImage?: string;
}

export function ProductCard({ id, name, name_bn, price, price_bn, image, nutritionImage, cookingImage }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { language } = useLanguageStore();

    const displayPrice = language === 'bn' && price_bn ? price_bn : price;
    const displayName = language === 'bn' && name_bn ? name_bn : name;

    const handleAddToCart = () => {
        addItem({ id, name, price: Number(price.replace(/[^0-9.]/g, '')), image, quantity: 1 });
        toast.custom((t) => (
            <div className="flex items-center gap-4 w-full bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{name}</h4>
                    <p className="text-gray-500 text-xs">Added to cart</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Plus className="w-4 h-4" />
                </div>
            </div>
        ), { duration: 2000, position: 'top-center' });
    };

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-scale-in hover-scale cursor-pointer"
                onClick={() => setShowModal(true)}
            >
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
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-crab-red transition-colors active:scale-95 z-10"
                            aria-label="Add to cart"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                product={{ id, name, price, image, nutritionImage, cookingImage }}
            />
        </>
    );
}
