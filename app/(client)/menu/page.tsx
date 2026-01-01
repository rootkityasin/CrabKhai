'use client';

import { ProductCard } from '@/components/client/ProductCard';
import { Search } from 'lucide-react';

// Scraped Data from crabkhaibd.com
// import { menuItems } from '@/lib/data';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useAdmin } from '@/components/providers/AdminProvider';

function MenuContent() {
    const { allProducts } = useAdmin();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('search') || '';
    const category = searchParams.get('category');

    const [searchQuery, setSearchQuery] = useState(initialQuery);

    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    // Filter logic
    // We filter based on 'allProducts' from AdminProvider now
    const filteredItems = allProducts.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        // Note: AdminProvider products might not have 'categoryId' explicitly matching the old data schema
        // But for now we focus on search and listing.
        const matchesCategory = category ? (item as any).categoryId === category : true;
        // Only show valid selling products
        const isActive = item.stage === 'Selling' || item.stage === 'Published';

        return matchesSearch && matchesCategory && isActive;
    });

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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Menu Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            price={String(item.price)}
                            image={item.image}
                            // Fallbacks for missing fields in AdminProvider 
                            name_bn={(item as any).name_bn || item.name}
                            price_bn={(item as any).price_bn || String(item.price)}
                            pieces={(item as any).pieces}
                        />
                    ))
                ) : (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                        <p>No delicious crabs found matching "{searchQuery}"</p>
                    </div>
                )}
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
