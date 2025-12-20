import { HeroCarousel } from '@/components/client/HeroCarousel';
import { CategoryNav } from '@/components/client/CategoryNav';
import { ProductRail } from '@/components/client/ProductRail';
import { PromoModal } from "@/components/client/PromoModal";

// Real Data from crabkhaibd.com
const bestSellers = [
    {
        id: '1',
        name: 'Signature Masala Crab wings',
        price: '350',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/651903648889884.png'
    },
    {
        id: '2',
        name: 'Signature Masala Crab Bomb',
        price: '350',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/1684482693291279.png'
    },
    {
        id: '3',
        name: 'Crispy Crab Wings',
        price: '330',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/604194297355933.png'
    },
];

const bestDeals = [
    {
        id: '4',
        name: 'WINGS & BOMB COMBO',
        price: 'BDT 1200 (Save 120)',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/4838007732246716.jpg'
    },
    {
        id: '5',
        name: 'Tempura Shrimp',
        price: '400',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/745402355963125.png'
    },
];

const newArrivals = [
    {
        id: '6',
        name: 'Raw Crab Clean',
        price: '450',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/587600975137614.png'
    },
    {
        id: '7',
        name: 'Crispy Crab Bomb',
        price: '330',
        image: 'https://www.easykoro.com/inventories/fit-in/400x400/606088101401451.png'
    },
];

// Main landing page for the client application
export default function ClientHomePage() {
    return (
        <div className="pb-8">
            <PromoModal />
            <HeroCarousel />
            <CategoryNav />
            <ProductRail title="Best Sellers" products={bestSellers} />
            <ProductRail title="Super Savings" products={bestDeals} />
            <ProductRail title="New Arrivals" products={newArrivals} />
        </div>
    );
}
