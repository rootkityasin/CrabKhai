'use client';

import { useEffect, useState } from 'react';
import { getRecommendedProducts } from '@/app/actions/recommendations';
import { useCartStore } from '@/lib/store';
import useEmblaCarousel from 'embla-carousel-react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function CartRecommendations() {
    const { items, addItem } = useCartStore();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

    useEffect(() => {
        const fetchRecs = async () => {
            const excludeIds = items.map(i => i.id);
            const data = await getRecommendedProducts(excludeIds, 8);
            setRecommendations(data);
            setLoading(false);
        };
        fetchRecs();
    }, [items.length]); // Refetch if cart items change (to exclude newly added)

    if (loading) return null;
    if (recommendations.length === 0) return null;

    const handleAdd = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            // Assuming default unit/step
        });
        toast.success(`Added ${product.name} to cart`);
    };

    return (
        <div className="mt-12 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-heading">Recommended for You</h3>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {recommendations.map((product) => (
                        <div key={product.id} className="flex-none w-[180px] md:w-[220px] bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-all group">
                            <div className="aspect-square bg-gray-50 rounded-md mb-3 overflow-hidden relative">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
                                )}
                                <button
                                    onClick={() => handleAdd(product)}
                                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-crab-red hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-crab-red text-sm">৳{product.price}</span>
                                    <button
                                        onClick={() => handleAdd(product)}
                                        className="text-xs font-bold text-gray-500 hover:text-crab-red underline decoration-dotted"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
