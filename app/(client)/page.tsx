import { HeroCarousel } from '@/components/client/HeroCarousel';
import { CategoryNav } from '@/components/client/CategoryNav';
import { ProductRail } from '@/components/client/ProductRail';
import { PromoModal } from "@/components/client/PromoModal";
import TrustFooter from "@/components/client/TrustFooter";

import { menuItems } from '@/lib/data';

// Derived data from the single source of truth
const bestSellers = menuItems.filter(item => ['103', '107', '101', '104'].includes(item.id));
const bestDeals = menuItems.filter(item => ['105', '104'].includes(item.id));
const newArrivals = menuItems.filter(item => ['106', '102'].includes(item.id));

import { getSiteConfig } from "@/app/actions/settings";
import { Footer } from "@/components/client/Footer";
import { ProductInfo } from "@/components/client/ProductInfo";

// ... existing imports

// Main landing page for the client application
export default async function ClientHomePage() {
    const config = await getSiteConfig();

    return (
        <div>
            <PromoModal />
            <HeroCarousel />
            <CategoryNav />
            <ProductRail title="Best Sellers" products={bestSellers} enableScrollAnimation={true} />
            <ProductRail title="Super Savings" products={bestDeals} />
            <ProductRail title="New Arrivals" products={newArrivals} />
            <TrustFooter config={config} />
        </div>
    );
}
