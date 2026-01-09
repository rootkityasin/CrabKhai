'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig, updateSiteConfig, getPaymentConfig, updatePaymentConfig } from '@/app/actions/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, MapPin, Phone, Mail, FileWarning, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { MediaUpload } from '@/components/admin/MediaUpload';

export function ShopGeneralSettings({ initialConfig }: { initialConfig?: any }) {
    const [loading, setLoading] = useState(!initialConfig);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<any>(initialConfig || {
        contactPhone: '',
        contactEmail: '',
        contactAddress: '',
        shopName: '',
        logoUrl: '',
        measurementUnit: 'PCS',
        allergensText: '',
        certificates: [] // Future use
    });
    const [paymentConfig, setPaymentConfig] = useState<any>({});

    useEffect(() => {
        if (!initialConfig) {
            async function load() {
                const [data, payConfig] = await Promise.all([
                    getSiteConfig(),
                    getPaymentConfig()
                ]);

                if (data) {
                    setConfig(data);
                }
                if (payConfig) {
                    setPaymentConfig(payConfig);
                }
                setLoading(false);
            }
            load();
        }
    }, [initialConfig]);

    const handleSave = async () => {
        setSaving(true);
        const [res, payRes] = await Promise.all([
            updateSiteConfig(config),
            updatePaymentConfig(paymentConfig)
        ]);

        if (res.success && payRes.success) {
            toast.success("Shop settings saved successfully");
        } else {
            toast.error("Failed to save settings");
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">General Information</h2>
                    <p className="text-sm text-slate-500">Manage your contact details and store information.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-500" /> Contact Info
                        </CardTitle>
                        <CardDescription>Displayed in footer and contact page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={config.contactPhone}
                                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                                placeholder="+880 1..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                value={config.contactEmail}
                                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                                placeholder="hello@example.com"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" /> Location & Branding
                        </CardTitle>
                        <CardDescription>Your store identity and physical address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Shop Name</Label>
                            <Input
                                value={config.shopName}
                                onChange={(e) => setConfig({ ...config, shopName: e.target.value })}
                                placeholder="e.g. Crab & Khai"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Shop Logo</Label>
                            <MediaUpload
                                value={config.logoUrl || ''}
                                onChange={(url) => setConfig({ ...config, logoUrl: url })}
                                onRemove={() => setConfig({ ...config, logoUrl: '' })}
                            />
                            <p className="text-xs text-slate-500">
                                Recommended size: <strong>500x500px</strong>.
                                <br />
                                Supported formats: JPG, PNG, WEBP.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Textarea
                                value={config.contactAddress}
                                onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })}
                                placeholder="Street Address, City, Country"
                                className="h-20 resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Settings & Units */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Settings
                        </CardTitle>
                        <CardDescription>Configure measurement units and system preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Measurement Unit</Label>
                            <Select
                                value={config.measurementUnit || 'PCS'}
                                onValueChange={(val) => setConfig({ ...config, measurementUnit: val })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PCS">Pieces (Default)</SelectItem>
                                    <SelectItem value="WEIGHT">Weight (Kg/Gm)</SelectItem>
                                    <SelectItem value="VOLUME">Volume (Litre/Ml)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">
                                Controls how stock is displayed and calculated.
                                {config.measurementUnit === 'WEIGHT' && ' (1 Unit = 200g)'}
                                {config.measurementUnit === 'VOLUME' && ' (1 Unit = 1 Litre)'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Legal / Allergens */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileWarning className="w-4 h-4 text-slate-500" /> Allergens & Notices
                        </CardTitle>
                        <CardDescription>Important information for your customers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Allergen Information</Label>
                            <Input
                                value={config.allergensText}
                                onChange={(e) => setConfig({ ...config, allergensText: e.target.value })}
                                placeholder="e.g. Contains Crustaceans"
                            />
                            <p className="text-xs text-slate-500">This will be displayed in the footer or product pages.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
