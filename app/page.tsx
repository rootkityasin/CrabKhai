
import { HeroCarousel } from '@/components/client/HeroCarousel';
import { CategoryNav } from '@/components/client/CategoryNav';
import { ProductRail } from '@/components/client/ProductRail';
import { MobileHeader } from "@/components/client/MobileHeader";
import { BottomNav } from "@/components/client/BottomNav";
import { PromoModal } from "@/components/client/PromoModal";

// Mock Data
const bestSellers = [
  { id: '101', name: 'Singapore Chili Crab', price: 1250, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=400&fit=crop' },
  { id: '102', name: 'Garlic Butter Prawns', price: 850, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&fit=crop' },
  { id: '103', name: 'Crab Masala Platter', price: 1500, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&fit=crop' },
];

const newArrivals = [
  { id: '201', name: 'Soft Shell Crab Fry', price: 950, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400&fit=crop' },
  { id: '202', name: 'Spicy Squid Roast', price: 650, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=400&fit=crop' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <PromoModal />
      <MobileHeader />
      <main className="flex-1 w-full max-w-md mx-auto bg-white min-h-[calc(100vh-3.5rem)]">
        <div className="pb-8">
          <HeroCarousel />
          <CategoryNav />
          <ProductRail title="Best Sellers" products={bestSellers} />
          <ProductRail title="New Arrivals" products={newArrivals} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
