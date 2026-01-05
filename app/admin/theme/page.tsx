'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Layout, Check, Monitor, Smartphone, RotateCcw, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getSiteConfig, updateSiteConfig } from '@/app/actions/settings';
import { getHeroSlides } from '@/app/actions/hero';
import { getProducts } from '@/app/actions/product';
import { ProductCard } from '@/components/client/ProductCard';

// Color Presets
const PRESETS = [
    { name: 'Crab Red (Current)', primary: '#E60000', secondary: '#0f172a' },
    { name: 'Crab Orange', primary: '#ea580c', secondary: '#0f172a' },
    { name: 'Ocean Blue', primary: '#0284c7', secondary: '#0f172a' },
    { name: 'Emerald Green', primary: '#059669', secondary: '#064e3b' },
    { name: 'Royal Purple', primary: '#7c3aed', secondary: '#1e1b4b' },
    { name: 'Hot Pink', primary: '#db2777', secondary: '#831843' },
    { name: 'Midnight', primary: '#0f172a', secondary: '#000000' },
];

function hexToHsl(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) { h = s = 0; }
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        if (h) h /= 6;
    }
    if (h) h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
}


export default function ThemePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('#E60000');
    const [secondaryColor, setSecondaryColor] = useState('#0f172a');
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const config = await getSiteConfig();
            const slides = await getHeroSlides();
            const allProducts = await getProducts();

            if (config) {
                // @ts-ignore
                if (config.primaryColor) setPrimaryColor(config.primaryColor);
                // @ts-ignore
                if (config.secondaryColor) setSecondaryColor(config.secondaryColor);
            }
            if (slides) setHeroSlides(slides.filter((s: any) => s.isActive));
            if (allProducts) setProducts(allProducts.slice(0, 4));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await updateSiteConfig({
                primaryColor,
                secondaryColor
            });
            if (res.success) {
                toast.success("Theme Published Successfully!");
                // Force reload to apply changes globally
                window.location.reload();
            } else {
                toast.error("Failed to save theme");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = (preset: typeof PRESETS[0]) => {
        setPrimaryColor(preset.primary);
        setSecondaryColor(preset.secondary);
    };

    // Dynamic styles for preview container
    const previewStyles = {
        '--crab-red': primaryColor,
        '--primary': hexToHsl(primaryColor),
        // We can override other variables if needed
    } as React.CSSProperties;

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-96 space-y-8 overflow-y-auto pr-4 pb-20">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Theme & Brand</h1>
                    <p className="text-slate-500 mt-2">Customize your storefront's look and feel.</p>
                </div>

                <div className="space-y-6">
                    {/* Brand Colors */}
                    <Card className="p-6 border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                            <Palette className="w-5 h-5 text-purple-600" />
                            Brand Colors
                        </div>

                        {/* Primary Color */}
                        <div className="space-y-3">
                            <Label>Primary Color (Buttons, Highlights)</Label>
                            <div className="flex gap-3">
                                <div className="h-12 w-12 rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 relative">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: primaryColor }} />
                                    <Input
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="font-mono pl-10 uppercase"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Secondary Color */}
                        <div className="space-y-3">
                            <Label>Secondary Color (Dark Mode/Accents)</Label>
                            <div className="flex gap-3">
                                <div className="h-12 w-12 rounded-xl border border-gray-200 overflow-hidden shadow-sm shrink-0 relative">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: secondaryColor }} />
                                    <Input
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="font-mono pl-10 uppercase"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Presets */}
                    <Card className="p-6 border-slate-200 shadow-sm">
                        <Label className="mb-4 block">Quick Presets</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyPreset(preset)}
                                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-left flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.secondary} 50%)` }}>
                                        {primaryColor === preset.primary && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 -mx-4 -mb-20 z-10">
                    <Button variant="outline" className="flex-1" onClick={loadConfig}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    <Button
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Publish Theme
                    </Button>
                </div>
            </div>

            {/* Live Preview Area */}
            <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border border-slate-200/50 p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                <div className="absolute top-6 flex bg-white/50 backdrop-blur-md rounded-full shadow-sm p-1 border border-white/20 z-10">
                    <div className="px-4 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold text-slate-800 flex items-center gap-2">
                        <Monitor className="w-3 h-3" /> Live Preview
                    </div>
                </div>

                {/* Mock Browser/Phone Container */}
                <div
                    className="w-[375px] h-[700px] bg-slate-50 rounded-[3rem] border-[12px] border-slate-900 shadow-2xl overflow-hidden relative select-none ring-4 ring-slate-900/10"
                    style={previewStyles}
                >
                    {/* StatusBar */}
                    <div className="h-12 bg-white flex justify-between px-8 items-center text-xs font-bold text-slate-900 z-20 relative">
                        <span>9:41</span>
                        <div className="flex gap-1.5">
                            <div className="w-4 h-2.5 bg-slate-900 rounded-[1px]" />
                            <div className="w-4 h-2.5 bg-slate-900 rounded-[1px]" />
                            <div className="w-6 h-2.5 bg-slate-900 rounded-[2px] opacity-30" />
                        </div>
                    </div>

                    {/* App Header Mock - Matching Real Frontend */}
                    <div className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 text-white border-b border-white/10" style={{ backgroundColor: primaryColor }}>
                        <div className="flex items-center gap-2">
                            {/* Hamburger Menu */}
                            <div className="w-6 h-6 flex flex-col justify-center gap-1">
                                <div className="w-5 h-0.5 bg-white rounded"></div>
                                <div className="w-5 h-0.5 bg-white rounded"></div>
                                <div className="w-5 h-0.5 bg-white rounded"></div>
                            </div>
                            {/* Logo Mock */}
                            <div className="flex items-center gap-1 font-bold text-sm leading-none">
                                <span className="text-white">Crab</span>
                                <span className="text-white">&</span>
                                <span className="text-white">Khai</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            {/* Search Icon */}
                            <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                                <div className="w-1.5 h-1.5 border border-white rounded-full"></div>
                            </div>
                            {/* Location Pin */}
                            <div className="w-4 h-5 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-white rounded-full"></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-white"></div>
                            </div>
                            {/* Shopping Cart with Badge */}
                            <div className="relative">
                                <div className="w-4 h-4">
                                    <div className="w-3 h-2.5 border-2 border-white rounded-sm"></div>
                                    <div className="absolute top-0 left-0 w-2.5 h-1 border-t-2 border-white"></div>
                                </div>
                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[6px] font-bold rounded-full w-2.5 h-2.5 flex items-center justify-center">2</div>
                            </div>
                            {/* User Icon */}
                            <div className="w-4 h-4 flex flex-col items-center justify-center">
                                <div className="w-2 h-2 border-2 border-white rounded-full"></div>
                                <div className="w-3.5 h-2 border-2 border-white border-t-0 rounded-b-full mt-[-2px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content Scroll View */}
                    <div className="h-full overflow-y-auto pb-32 no-scrollbar bg-slate-50">

                        {/* Hero Banner - Matching Real Frontend */}
                        <div className="h-48 relative m-4 rounded-2xl overflow-hidden shadow-sm">
                            {heroSlides.length > 0 ? (
                                <>
                                    <img
                                        src={heroSlides[0].imageUrl}
                                        alt={heroSlides[0].title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 text-[8px] font-bold text-white rounded" style={{ backgroundColor: primaryColor }}>
                                            {heroSlides[0].title}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="text-white text-2xl font-serif font-bold mb-2">{heroSlides[0].subtitle}</h2>
                                        <button
                                            className="px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-lg"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {heroSlides[0].buttonText || "Order Now"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src="https://images.unsplash.com/photo-1633504581786-316c8002b1b2?w=800&q=80"
                                        alt="Crab Curry"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 text-[8px] font-bold text-white rounded" style={{ backgroundColor: primaryColor }}>
                                            FRESH FROM SUNDARBANS
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="text-white text-2xl font-serif font-bold mb-2">Live Mud Crab</h2>
                                        <button
                                            className="px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-lg"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            Order Now
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Category Navigation - Matching Real Frontend */}
                        <div className="px-4 py-2 mb-2">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {['Live Crab', 'Platters', 'Best Sellers', 'Spicy', 'Sides'].map((cat, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1 min-w-[50px]">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
                                        </div>
                                        <span className="text-[8px] text-gray-600 text-center font-medium">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Best Sellers Section - Matching Real Frontend */}
                        <div className="px-4 py-2">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-slate-900 text-base">Best Sellers</h3>
                                <span className="text-xs font-bold" style={{ color: primaryColor }}>View All →</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {products.length > 0 ? (
                                    products.slice(0, 2).map((product, idx) => (
                                        <div key={product.id} className="transform scale-[0.85] origin-top-left w-[115%] -mb-[15%]">
                                            <ProductCard
                                                id={`preview-${product.id}`}
                                                name={product.name}
                                                price={product.price}
                                                image={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1559742811-664426563e41?w=800&q=80"}
                                                pieces={product.pieces}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {/* Fallback Product 1 */}
                                        <div className="transform scale-[0.85] origin-top-left w-[115%] -mb-[15%]">
                                            <ProductCard
                                                id="preview-1"
                                                name="Signature Masala Crab Wings"
                                                price={350}
                                                image="https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80"
                                                pieces={6}
                                            />
                                        </div>

                                        {/* Fallback Product 2 */}
                                        <div className="transform scale-[0.85] origin-top-left w-[115%] -mb-[15%]">
                                            <ProductCard
                                                id="preview-2"
                                                name="Crispy Crab Wings"
                                                price={330}
                                                image="https://images.unsplash.com/photo-1559742811-664426563e41?w=800&q=80"
                                                pieces={8}
                                                totalSold={245}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Promo Banner Mock */}
                        <div className="m-4 px-4 py-6 rounded-2xl text-center relative overflow-hidden text-white shadow-lg" style={{ backgroundColor: secondaryColor }}>
                            <div className="relative z-10">
                                <p className="text-sm font-medium opacity-80">Special Offer</p>
                                <h4 className="text-xl font-black mb-3">Free Delivery</h4>
                                <button className="bg-white text-xs font-bold py-2 px-4 rounded-full text-slate-900">
                                    Use Code: CRAB20
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        </div>
                    </div>

                    {/* Bottom Navigation - Matching Real Frontend */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-30">
                        <div className="flex items-center justify-around h-14 relative">
                            {/* Home - Active */}
                            <div className="flex flex-col items-center justify-center w-full h-full space-y-0.5 relative z-10" style={{ color: primaryColor }}>
                                <div className="absolute inset-0 w-10 h-10 m-auto bg-orange-50 rounded-2xl -z-10"></div>
                                <div className="relative">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <span className="text-[9px] font-medium">Home</span>
                            </div>
                            {/* Menu */}
                            <div className="flex flex-col items-center justify-center w-full h-full space-y-0.5 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                </svg>
                                <span className="text-[9px] font-medium">Menu</span>
                            </div>
                            {/* Story */}
                            <div className="flex flex-col items-center justify-center w-full h-full space-y-0.5 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="text-[9px] font-medium">Story</span>
                            </div>
                            {/* Cart */}
                            <div className="flex flex-col items-center justify-center w-full h-full space-y-0.5 text-gray-400">
                                <div className="relative">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="absolute -top-0.5 -right-1 flex h-3 min-w-[12px] items-center justify-center rounded-full px-0.5 text-[7px] font-bold text-white ring-1 ring-white" style={{ backgroundColor: primaryColor }}>2</span>
                                </div>
                                <span className="text-[9px] font-medium">Cart</span>
                            </div>
                            {/* Account */}
                            <div className="flex flex-col items-center justify-center w-full h-full space-y-0.5 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-[9px] font-medium">Account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
