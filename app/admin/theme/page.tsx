'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Layout, Check, Monitor, Smartphone, RotateCcw, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getSiteConfig, updateSiteConfig } from '@/app/actions/settings';
import { ProductCard } from '@/components/client/ProductCard';

// Color Presets
const PRESETS = [
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
    const [primaryColor, setPrimaryColor] = useState('#ea0000');
    const [secondaryColor, setSecondaryColor] = useState('#0f172a');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const config = await getSiteConfig();
            if (config) {
                // @ts-ignore
                if (config.primaryColor) setPrimaryColor(config.primaryColor);
                // @ts-ignore
                if (config.secondaryColor) setSecondaryColor(config.secondaryColor);
            }
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

                    {/* App Header Mock */}
                    <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Welcome</span>
                            <div className="flex items-center gap-1 font-bold text-lg leading-none text-slate-900 font-heading">
                                <span style={{ color: primaryColor }}>Crab</span> & Khai
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                        </div>
                    </div>

                    {/* Content Scroll View */}
                    <div className="h-full overflow-y-auto pb-32 no-scrollbar bg-slate-50">

                        {/* Hero Mock */}
                        <div className="h-48 relative bg-gray-200 m-4 rounded-2xl overflow-hidden shadow-sm">
                            <div className="absolute inset-0 bg-slate-900/10" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-white/90 backdrop-blur rounded-xl p-3 flex justify-between items-center shadow-lg">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Fresh Catch</p>
                                        <p className="text-[10px] text-slate-500">Just Arrived</p>
                                    </div>
                                    <button
                                        className="px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-lg transform active:scale-95 transition-transform"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid Mock */}
                        <div className="px-4 py-2">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-slate-900 text-lg">Popular Items</h3>
                                <span className="text-xs font-bold" style={{ color: primaryColor }}>View All</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Real Product Card Instance 1 */}
                                <div className="transform scale-[0.85] origin-top-left w-[115%] -mb-[15%]">
                                    <ProductCard
                                        id="preview-1"
                                        name="Jumbo Mud Crab"
                                        price={1250}
                                        image="https://images.unsplash.com/photo-1559742811-664426563e41?w=800"
                                        pieces={2}
                                    />
                                </div>

                                {/* Real Product Card Instance 2 */}
                                <div className="transform scale-[0.85] origin-top-left w-[115%] -mb-[15%]">
                                    <ProductCard
                                        id="preview-2"
                                        name="Soft Shell Crab"
                                        price={2200}
                                        image="https://images.unsplash.com/photo-1542385150-c0d162125f48?w=800"
                                        pieces={12}
                                        totalSold={150}
                                    />
                                </div>
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
                </div>
            </div>
        </div>
    );
}
