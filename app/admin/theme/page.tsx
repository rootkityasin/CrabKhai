'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Palette, Type, Layout, Check, Monitor, Smartphone, RotateCcw } from 'lucide-react';

export default function ThemePage() {
    const [primaryColor, setPrimaryColor] = useState('#ea580c');
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const handleSave = () => {
        alert('Theme settings saved! (Preview Mode)');
    };

    const handleReset = () => {
        setPrimaryColor('#ea580c');
        setMode('light');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 space-y-6 overflow-y-auto pr-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Customize Theme</h1>
                    <p className="text-sm text-slate-500">Style your storefront.</p>
                </div>

                <div className="space-y-4">
                    {/* Color Section */}
                    <Card className="p-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 font-bold text-slate-700">
                            <Palette className="w-4 h-4" /> Brand Color
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full border border-gray-200 overflow-hidden shadow-sm">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="h-[150%] w-[150%] -m-[25%] cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="font-mono uppercase"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Mode Section */}
                    <Card className="p-4 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 font-bold text-slate-700">
                            <Layout className="w-4 h-4" /> Appearance
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setMode('light')}
                                className={`p-3 rounded border text-sm flex flex-col items-center gap-2 transition-all ${mode === 'light' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className="w-8 h-8 rounded bg-white border border-gray-200 shadow-sm"></div>
                                Light Mode
                            </button>
                            <button
                                onClick={() => setMode('dark')}
                                className={`p-3 rounded border text-sm flex flex-col items-center gap-2 transition-all ${mode === 'dark' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <div className="w-8 h-8 rounded bg-slate-900 border border-gray-800 shadow-sm"></div>
                                Dark Mode
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
                    <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave}>Publish</Button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 right-4 flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                    <button className="p-2 hover:bg-gray-100 rounded text-slate-500"><Monitor className="w-4 h-4" /></button>
                    <button className="p-2 bg-gray-100 rounded text-slate-800"><Smartphone className="w-4 h-4" /></button>
                </div>

                {/* Mock Phone Preview */}
                <div className="w-[300px] h-[580px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative select-none pointer-events-none">
                    {/* StatusBar */}
                    <div className="h-6 bg-black text-white text-[10px] flex justify-between px-6 items-center">
                        <span>9:41</span>
                        <span>📶 🔋</span>
                    </div>
                    {/* App Header */}
                    <div className={`h-14 flex items-center justify-between px-4 shadow-sm transition-colors duration-300 ${mode === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                        <div className="font-bold flex items-center gap-1">
                            <span style={{ color: primaryColor }}>Crab</span><span className={mode === 'dark' ? 'text-white' : 'text-slate-900'}>Khai</span>
                        </div>
                    </div>
                    {/* App Content */}
                    <div className={`h-full p-4 space-y-4 ${mode === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="h-32 rounded-xl bg-gray-200 w-full animate-pulse" />
                        <div className="flex gap-3 overflow-hidden">
                            <div className="h-20 w-20 rounded-lg bg-gray-200 flex-shrink-0 animate-pulse" />
                            <div className="h-20 w-20 rounded-lg bg-gray-200 flex-shrink-0 animate-pulse" />
                            <div className="h-20 w-20 rounded-lg bg-gray-200 flex-shrink-0 animate-pulse" />
                        </div>
                        <div className="bg-white p-3 rounded-xl shadow-sm flex gap-3 items-center">
                            <div className="h-16 w-16 bg-gray-100 rounded-lg animate-pulse" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                            </div>
                            <div className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: primaryColor }}>
                                ADD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
