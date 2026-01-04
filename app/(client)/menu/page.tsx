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
    const filterId = searchParams.get('filter'); // 'new-arrivals', 'best-sellers', 'super-savings'

    // Filter logic
    const filteredItems = allProducts.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category ? (item as any).categoryId === category : true;

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
                            totalSold={(item as any).totalSold}
                            weightOptions={(item as any).weightOptions}
                            images={(item as any).images}
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
