'use client';

import { Settings, Globe, Shield, Truck, CreditCard, Megaphone, MessageSquare, Smartphone, Share2, ChevronRight, Save, Store, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

// Sub-components for specific settings to make it "Functional"
function GeneralSettings({ onSave }: { onSave: () => void }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name</label>
                    <div className="relative">
                        <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input defaultValue="CrabKhai BD" className="pl-9" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Support Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input defaultValue="+8801700000000" className="pl-9" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input defaultValue="support@crabkhai.com" className="pl-9" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Input defaultValue="BDT (৳)" disabled className="bg-gray-50" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Store Address</label>
                <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Textarea defaultValue="House 12, Road 5, Uttara, Dhaka" className="pl-9 min-h-[80px]" />
                </div>
            </div>
            <Button onClick={onSave} className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">Save Changes</Button>
        </div>
    )
}

export default function ShopPage() {
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const handleSave = () => {
        alert('Settings Saved Successfully! 💾');
        setActiveModule(null);
    };

    const modules = [
        { id: 'general', label: 'General Information', icon: Settings, desc: 'Store Name, Address, Email, Phone' },
        { id: 'domain', label: 'Shop Domain', icon: Globe, desc: 'Connect custom domain (Pro Only)' },
        { id: 'policy', label: 'Policies', icon: Shield, desc: 'Refund & Privacy policies' },
        { id: 'shipping', label: 'Delivery Settings', icon: Truck, desc: 'Shipping zones & fees' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Manage Shop</h1>
                    <p className="text-sm text-slate-500">Configure your store identity and operations.</p>
                </div>
                {activeModule && (
                    <Button variant="outline" onClick={() => setActiveModule(null)}>Back to Menu</Button>
                )}
            </div>

            {activeModule === 'general' ? (
                <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-orange-600" /> General Information
                        </h2>
                        <p className="text-sm text-slate-500">Update your store's basic contact details.</p>
                    </div>
                    <GeneralSettings onSave={handleSave} />
                </Card>
            ) : activeModule ? (
                <Card className="p-12 text-center animate-in fade-in zoom-in-95">
                    <div className="text-4xl mb-4">🚧</div>
                    <h2 className="text-xl font-bold text-slate-800">Work in Progress</h2>
                    <p className="text-slate-500 mb-6">This module is coming soon.</p>
                    <Button onClick={() => setActiveModule(null)}>Go Back</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((item) => (
                        <Card
                            key={item.id}
                            onClick={() => setActiveModule(item.id)}
                            className="relative overflow-hidden group hover:shadow-lg transition-shadow border-gray-100 cursor-pointer bg-white"
                        >
                            <div className="p-6 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-slate-800">{item.label}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
