'use client';

import { Menu, Search, MapPin, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/lib/languageStore';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store';
import { menuItems } from '@/lib/data';

import { translations } from '@/lib/translations';

export function MobileHeader() {
    const [mounted, setMounted] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const { language, toggleLanguage } = useLanguageStore();
    const t = translations[language];

    const searchRef = useRef<HTMLDivElement>(null);
    const searchTriggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);

        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node) &&
                searchTriggerRef.current &&
                !searchTriggerRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/menu?search=${encodeURIComponent(searchTerm)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-crab-red border-b border-white/10 shadow-md relative">
                <div className="flex items-center justify-between px-4 h-16 text-white">
                    {/* Left: Logo Area */}
                    <div className="flex items-center gap-3">
                        <button className="p-1 -ml-1 text-white" onClick={() => router.push('/menu')}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="CrabKhai" className="h-14 w-auto" />
                        </Link>
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className={`ml-1 px-2 py-1 rounded border border-white/20 text-[10px] font-bold tracking-wider hover:bg-white/10 transition-colors ${language === 'bn' ? 'font-bangla' : 'font-body'}`}
                        >
                            {language === 'en' ? 'বাংলা' : 'EN'}
                        </button>
                    </div>

                    {/* Right: Icons (Search, Pin, Cart, User) */}
                    <div className="flex items-center gap-3">
                        <button
                            ref={searchTriggerRef}
                            className={`p-1 transition-colors ${isSearchOpen ? 'text-yellow-400' : 'text-white'}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                if ('geolocation' in navigator) {
                                    navigator.geolocation.getCurrentPosition((position) => {
                                        const userLat = position.coords.latitude;
                                        const userLng = position.coords.longitude;

                                        const deliveryZones = [
                                            { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
                                            { name: 'Khulna', lat: 22.8456, lng: 89.5403 },
                                            { name: 'Chottogram', lat: 22.3569, lng: 91.7832 }
                                        ];

                                        let nearestCity = null;
                                        let minDistance = Infinity;

                                        deliveryZones.forEach(zone => {
                                            const R = 6371; // Radius of the earth in km
                                            const dLat = (zone.lat - userLat) * (Math.PI / 180);
                                            const dLon = (zone.lng - userLng) * (Math.PI / 180);
                                            const a =
                                                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                                Math.cos(userLat * (Math.PI / 180)) * Math.cos(zone.lat * (Math.PI / 180)) *
                                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                            const d = R * c; // Distance in km

                                            if (d < minDistance) {
                                                minDistance = d;
                                                nearestCity = zone.name;
                                            }
                                        });

                                        // Allowing a generous city-wide radius (e.g. 20km from center)
                                        if (minDistance <= 20) {
                                            alert(`${t.deliveryAreaSuccess} ${nearestCity}.`);
                                        } else {
                                            alert(t.deliveryAreaFail);
                                        }
                                    }, (error) => {
                                        alert(t.locationError);
                                        console.error(error);
                                    });
                                } else {
                                    alert(t.geoNotSupported);
                                }
                            }}
                            className="p-1 text-white hover:text-green-400"
                        >
                            <MapPin className="w-5 h-5" />
                        </button>
                        <Link href="/cart" className="p-1 text-white relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/account" className="p-1 text-white">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Search Bar Popup */}
                {isSearchOpen && (
                    <div ref={searchRef} className="absolute top-16 left-0 right-0 bg-white p-4 shadow-lg animate-in slide-in-from-top-2 z-40 border-b border-gray-100">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                autoFocus
                                placeholder={t.searchPlaceholder}
                                className={`w-full pl-9 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-crab-red/50 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>

                        {/* Search Suggestions */}
                        {searchTerm.length > 0 && (
                            <div className="mt-2 bg-white rounded-lg border border-gray-100 shadow-sm max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
                                {menuItems
                                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .slice(0, 5) // Limit to 5 suggestions
                                    .map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-200 animate-in fade-in slide-in-from-left-1"
                                            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                                            onClick={() => {
                                                router.push(`/menu?search=${encodeURIComponent(item.name)}`);
                                                setIsSearchOpen(false);
                                                setSearchTerm('');
                                            }}
                                        >
                                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-crab-red font-bold">৳{item.price}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                                {menuItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                    <div className={`p-4 text-center text-sm text-gray-400 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>
                                        {t.noItemsFound}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </header>
        </>
    );
}
