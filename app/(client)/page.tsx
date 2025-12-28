'use client';

import { HeroCarousel } from '@/components/client/HeroCarousel';
import { CategoryNav } from '@/components/client/CategoryNav';
import { ProductRail } from '@/components/client/ProductRail';
import { PromoModal } from "@/components/client/PromoModal";
import TrustFooter from "@/components/client/TrustFooter";

import { Footer } from "@/components/client/Footer";
import { ProductInfo } from "@/components/client/ProductInfo";
import { useAdmin } from '@/components/providers/AdminProvider';

// Main landing page for the client application
export default function ClientHomePage() {
    const { allProducts, settings } = useAdmin();
    // Use unfiltered products for the public homepage so they show regardless of Admin Hub selection
    const products = allProducts;

    // Filter for "Selling" stage available products
    const activeProducts = products.filter(p => p.stage === 'Selling' || p.stage === 'Published');

    // Mocking categories/rails logic based on available products
    // In a real app, these would be filtered by actual category tags or "featured" flags
    const bestSellers = activeProducts.slice(0, 4);
    const bestDeals = activeProducts.slice(2, 6);
    const newArrivals = activeProducts.slice(1, 5);

    return (
        <div>
            <PromoModal />
            <HeroCarousel />
            <CategoryNav />
            {bestSellers.length > 0 && <ProductRail title="Best Sellers" products={bestSellers} enableScrollAnimation={true} />}
            {bestDeals.length > 0 && <ProductRail title="Super Savings" products={bestDeals} />}
            {newArrivals.length > 0 && <ProductRail title="New Arrivals" products={newArrivals} />}
            {/* Fallback to show something if no products exist yet (e.g. empty admin) */}
            {activeProducts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No products available yet. Add them in the Admin Panel!</p>
                </div>
            )}
            <TrustFooter config={settings} />
        </div>
    );
}
