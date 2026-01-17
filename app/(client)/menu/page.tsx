'use client';

import { ProductCard } from '@/components/client/ProductCard';
import { Search, Filter, Sparkles, Utensils, Flame, Fish, Award, Star, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getProducts } from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';

// Helper to map icons
const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('live')) return Fish;
    if (n.includes('crab') && n.includes('masala')) return Flame;
    if (n.includes('spicy') || n.includes('bomb')) return Flame;
    if (n.includes('platter') || n.includes('combo')) return Utensils;
    if (n.includes('side') || n.includes('rice') || n.includes('bread')) return Star;
    if (n.includes('fry') || n.includes('fried')) return Award;
    return Utensils;
};

function MenuContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';

    const [products, setProducts] = useState<any[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    // Fetch Data
    useEffect(() => {
        const init = async () => {
            try {
                const [pData, cData] = await Promise.all([getProducts(), getCategories()]);

                // Show ALL products - no stage filtering for any shop type
                // Admin has full control over products
                setProducts(pData || []);

                const mappedCats = [
                    { id: 'all', name: 'All Items', icon: Utensils },
                    ...(cData || []).map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        icon: getCategoryIcon(c.name)
                    }))
                ];
                setCategoriesList(mappedCats);
            } catch (error) {
                console.error("Failed to load menu data", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Filter logic
    const filterId = searchParams.get('filter'); // 'new-arrivals', 'best-sellers', 'super-savings'

    const filteredItems = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category && category !== 'all' ? item.categoryId === category : true; // Exact ID match

        let matchesFilter = true;
        if (filterId === 'best-sellers') {
            matchesFilter = true; // Use sort instead
        } else if (filterId === 'super-savings') {
            matchesFilter = item.type === 'COMBO';
        }

        return matchesSearch && matchesCategory && matchesFilter;
    });

    // Special sorting
    if (filterId === 'best-sellers') {
        filteredItems.sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    } else if (filterId === 'new-arrivals') {
        filteredItems.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-32 text-center text-slate-400">
                <div className="animate-pulse">Loading menu...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 flex gap-8 lg:gap-12">
                {/* Desktop Sidebar */}
                <div className="w-64 shrink-0 hidden lg:block sticky top-32 h-fit space-y-8 animate-in slide-in-from-left-4 duration-700">
                    {/* Search */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Search</h3>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-crab-red transition-colors" />
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-crab-red focus:ring-4 focus:ring-crab-red/10 transition-all shadow-sm"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Categories</h3>
                        <div className="space-y-2">
                            {categoriesList.map(cat => {
                                const isActive = category === cat.id;
                                // Calculate real count (approximate as we don't fetch counts separately but filter locally)
                                const count = cat.id === 'all'
                                    ? products.length
                                    : products.filter(p => p.categoryId === cat.id).length;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => router.push(`/menu?category=${cat.id}&search=${searchQuery}`)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all duration-300 group",
                                            isActive
                                                ? "bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 scale-105"
                                                : "bg-transparent text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent hover:border-slate-100"
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            {cat.name}
                                        </span>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-md border font-bold transition-colors",
                                            isActive
                                                ? "bg-white/20 border-transparent text-white"
                                                : "bg-slate-100 border-slate-200 text-slate-400 group-hover:bg-white group-hover:border-slate-200"
                                        )}>
                                            {count || 0}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 space-y-4">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                Full Menu <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            </h1>
                            <div className="relative w-full group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-crab-red transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search delicious crabs..."
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all font-body shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Scrolling Category Pills (Mobile) */}
                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar mask-gradient-right -mx-4 px-4">
                            {categoriesList.map((cat) => {
                                const isActive = category === cat.id;
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => router.push(`/menu?category=${cat.id}&search=${searchQuery}`)}
                                        className={cn(
                                            "snap-start flex-none flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap border",
                                            isActive
                                                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-crab-red/50 hover:text-crab-red"
                                        )}
                                    >
                                        <Icon className={cn("w-3.5 h-3.5", isActive ? "text-yellow-400" : "text-gray-400")} />
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                                        name_bn={item.name_bn || item.name}
                                        price_bn={item.price_bn || String(item.price)}
                                        pieces={item.pieces}
                                        totalSold={item.totalSold}
                                        weightOptions={item.weightOptions}
                                        images={item.images}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-20 text-center"
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
                                </motion.div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 font-heading">
                                    No crabs found!
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">
                                    Try adjusting your search filters.
                                </p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="px-6 py-2.5 bg-crab-red text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition-all text-sm"
                                >
                                    Clear Search
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center py-12 text-gray-400 text-sm">
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
