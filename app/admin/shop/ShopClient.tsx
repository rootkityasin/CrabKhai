'use client';

import { Settings, Globe, Shield, Truck, ChevronRight, Store, Mail, Phone, MapPin, AlertTriangle, BadgeCheck, Plus, Trash2, LayoutTemplate } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateSiteConfig } from '@/app/actions/settings';

interface SiteConfig {
    storeName?: string;
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    allergensText: string;
    certificates: string[];
}

function GeneralSettings({ initialConfig }: { initialConfig: SiteConfig }) {
    const [config, setConfig] = useState(initialConfig);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateSiteConfig(config);
        setIsSaving(false);
        if (result.success) toast.success("General settings saved!");
        else toast.error("Failed to save settings.");
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name (Local)</label>
                    <Input value={config.storeName || "CrabKhai BD"} disabled className="bg-slate-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9" value={config.contactPhone} onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9" value={config.contactEmail} onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Store Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Textarea className="pl-9 min-h-[80px]" value={config.contactAddress} onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end border-t pt-4">
                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}

function FooterSettings({ initialConfig }: { initialConfig: SiteConfig }) {
    const [config, setConfig] = useState(initialConfig);
    const [newCert, setNewCert] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const addCert = () => {
        if (!newCert) return;
        setConfig({ ...config, certificates: [...config.certificates, newCert] });
        setNewCert('');
    };

    const removeCert = (index: number) => {
        setConfig({ ...config, certificates: config.certificates.filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateSiteConfig(config);
        setIsSaving(false);
        if (result.success) toast.success("Footer settings saved!");
        else toast.error("Failed to save settings.");
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-red-500" /> Allergen Warning Text
                    </label>
                    <Input
                        value={config.allergensText}
                        onChange={(e) => setConfig({ ...config, allergensText: e.target.value })}
                        placeholder="e.g. Crustaceans, Shellfish"
                    />
                    <p className="text-xs text-slate-400">Displayed in footer warning section.</p>
                </div>

                <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium">Trust Certifications (Image URLs)</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Paste image URL..."
                            value={newCert}
                            onChange={(e) => setNewCert(e.target.value)}
                        />
                        <Button onClick={addCert} size="sm" variant="secondary"><Plus className="w-4 h-4" /></Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {config.certificates.map((cert, i) => (
                            <div key={i} className="group relative aspect-square bg-slate-50 rounded border flex items-center justify-center p-2">
                                <img src={cert} alt="" className="w-full h-full object-contain" />
                                <button
                                    onClick={() => removeCert(i)}
                                    className="absolute top-1 right-1 p-1 bg-white shadow-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end border-t pt-4">
                <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}

export function ShopClient({ initialConfig }: { initialConfig: any }) {
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const modules = [
        { id: 'general', label: 'General Information', icon: Settings, desc: 'Store Name, Address, Contacts' },
        { id: 'footer', label: 'Footer & Trust', icon: LayoutTemplate, desc: 'Certifications, Allergens, Warnings' },
        { id: 'domain', label: 'Shop Domain', icon: Globe, desc: 'Connect custom domain (Pro Only)' },
        { id: 'policy', label: 'Policies', icon: Shield, desc: 'Refund & Privacy policies' },
        { id: 'shipping', label: 'Delivery Settings', icon: Truck, desc: 'Shipping zones & fees' },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
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
                        <p className="text-sm text-slate-500">Update store details and contact info.</p>
                    </div>
                    <GeneralSettings initialConfig={initialConfig} />
                </Card>
            ) : activeModule === 'footer' ? (
                <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <LayoutTemplate className="w-5 h-5 text-purple-600" /> Footer & Trust
                        </h2>
                        <p className="text-sm text-slate-500">Manage certifications, safety warnings, and footer appearance.</p>
                    </div>
                    <FooterSettings initialConfig={initialConfig} />
                </Card>
            ) : activeModule ? (
                <Card className="p-12 text-center animate-in fade-in zoom-in-95">
                    <div className="text-4xl mb-4">🚧</div>
                    <h2 className="text-xl font-bold text-slate-800">Work in Progress</h2>
                    <p className="text-slate-500 mb-6">This module is coming soon.</p>
                    <Button onClick={() => setActiveModule(null)}>Go Back</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
