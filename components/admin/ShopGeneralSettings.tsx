'use client';

import { useState, useEffect } from 'react';
import { getSiteConfig, updateSiteConfig } from '@/app/actions/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save, MapPin, Phone, Mail, FileWarning } from 'lucide-react';

export function ShopGeneralSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<any>({
        contactPhone: '',
        contactEmail: '',
        contactAddress: '',
        allergensText: '',
        certificates: [] // Future use
    });

    useEffect(() => {
        async function load() {
            const data = await getSiteConfig();
            if (data) {
                setConfig(data);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const res = await updateSiteConfig(config);
        if (res.success) {
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

                {/* Location */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" /> Location
                        </CardTitle>
                        <CardDescription>Your physical store or office address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Textarea
                                value={config.contactAddress}
                                onChange={(e) => setConfig({ ...config, contactAddress: e.target.value })}
                                placeholder="Street Address, City, Country"
                                className="h-32 resize-none"
                            />
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
