'use client';

import { ProductCard } from '@/components/client/ProductCard';
import { Search, Filter, Sparkles, Utensils, Flame, Fish, Award, Star, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useAdmin } from '@/components/providers/AdminProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming utils exists

const categories = [
    { id: 'all', name: 'All Items', icon: Utensils },
    { id: '1', name: 'Live Crab', icon: Fish },
    { id: '2', name: 'Platters', icon: Utensils },
    { id: '3', name: 'Best Sellers', icon: Award },
    { id: '4', name: 'Spicy', icon: Flame },
    { id: '5', name: 'Sides', icon: Star },
];

function MenuContent() {
    const { allProducts } = useAdmin();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';

    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    // Filter logic
    // We filter based on 'allProducts' from AdminProvider now
    const filterId = searchParams.get('filter'); // 'new-arrivals', 'best-sellers', 'super-savings'

    // Filter logic
    const filteredItems = allProducts.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category && category !== 'all' ? (item as any).categoryId === category : true;

        // Virtual filters (mirroring landing page logic)
        // In a real app these would be DB fields, but for now we mimic the slice behavior or specific IDs if we had them.
        // Since we can't easily replicate the exact "slice" without order context, we'll try to approximate or just show all if no better signal.
        // ACTUALLY: The landing page slices are arbitrary (best sellers = first 4). 
        // Better strategy: Filter based on simple rules or assumed metadata.
        // For this user's existing logic:
        // New Arrivals = items with high IDs or recent dates? (We don't have created_at sorted easily here without sorting first)
        // Best Sellers = items with high totalSold
        // Super Savings = items with price < X or specific IDs?

        // Let's implement simplified logic for the view all page:
        let matchesFilter = true;
        if (filterId === 'best-sellers') {
            // Show all items, but sorted by popularity.
            // If data is missing (undefined), it falls back to 0.
            matchesFilter = true;
        } else if (filterId === 'super-savings') {
            // For savings, we focus on Combo packs which are usually deals.
            matchesFilter = item.type === 'COMBO';
        } else if (filterId === 'new-arrivals') {
            // Show all, sorted by date.
            matchesFilter = true;
        }

        const isActive = item.stage === 'Selling' || item.stage === 'Published' || item.stage === 'Coming Soon';

        return matchesSearch && matchesCategory && matchesFilter && isActive;
    });

    // Special sorting for filters
    if (filterId === 'best-sellers') {
        filteredItems.sort((a, b) => ((b as any).totalSold || 0) - ((a as any).totalSold || 0));
    } else if (filterId === 'new-arrivals') {
        // Sort by createdAt descending (newest first)
        filteredItems.sort((a, b) => {
            const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
            const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
            return dateB - dateA;
        });
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-14 md:pt-20">
            {/* Modern Header & Filters */}
            <div className="bg-gray-50/95 pb-2 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                    <div className="flex flex-col gap-4">
                        {/* Title & Search Row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 flex items-center gap-2">
                                Full Menu <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500 hidden md:block" />
                            </h1>
                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-crab-red transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search delicious crabs..."
                                    className="w-full pl-10 pr-10 py-2.5 bg-white/50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:bg-white transition-all font-body shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Scrolling Category Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar mask-gradient-right">
                            {categories.map((cat) => {
                                const isActive = category === cat.id;
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => router.push(`/menu?category=${cat.id}&search=${searchQuery}`)}
                                        className={cn(
                                            "snap-start flex-none flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap border",
                                            isActive
                                                ? "bg-gray-900 text-white border-gray-900 shadow-md scale-105"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-crab-red/50 hover:text-crab-red active:scale-95 shadow-sm"
                                        )}
                                    >
                                        <Icon className={cn("w-3.5 h-3.5", isActive ? "text-yellow-400" : "text-gray-400")} />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <ProductCard
                                    id={item.id}
                                    name={item.name}
                                    price={String(item.price)}
                                    image={item.image}
                                    // Fallbacks for missing fields in AdminProvider 
                                    name_bn={(item as any).name_bn || item.name}
                                    price_bn={(item as any).price_bn || String(item.price)}
                                    pieces={(item as any).pieces}
                                    totalSold={(item as any).totalSold}
                                    weightOptions={(item as any).weightOptions}
                                    images={(item as any).images}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-20 text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="text-7xl md:text-8xl mb-6 relative inline-block"
                            >
                                🦀
                                <motion.span
                                    className="absolute -top-4 -right-4 text-4xl"
                                    animate={{ opacity: [0, 1, 0], y: -20 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ❓
                                </motion.span>
                                <motion.span
                                    className="absolute -bottom-2 -left-2 text-3xl"
                                    animate={{ opacity: [0, 1, 0], x: -20 }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    💨
                                </motion.span>
                            </motion.div>

                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 font-heading">
                                Holy Crab! Where did it go?
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm md:text-base">
                                We looked everywhere but found nothing. Maybe it crawled away?
                            </p>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSearchQuery('')}
                                    className="px-6 py-2.5 bg-crab-red text-white font-bold rounded-full shadow-lg shadow-crab-red/30 hover:bg-red-600 transition-all text-sm"
                                >
                                    Clear Search
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/menu?category=all')}
                                    className="px-6 py-2.5 bg-white text-gray-600 font-bold rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all text-sm"
                                >
                                    View All
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="text-center py-8 text-gray-400 text-sm">
                ~ End of Menu ~
            </div>
        </div>
    );
}

export default function MenuPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading menu...</div>}>
            <MenuContent />
        </Suspense>
    );
}
