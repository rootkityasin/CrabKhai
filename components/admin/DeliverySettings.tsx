'use client';

import { useState, useEffect } from 'react';
import { getDeliveryConfig, updateDeliveryConfig } from '@/app/actions/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, Trash2, Plus, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function DeliverySettings({ onBack }: { onBack?: () => void }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<any>({
        defaultCharge: 60,
        defaultCodEnabled: true,
        nonRefundable: false,
        weightBasedCharges: [],
        deliveryZones: [],
        courierPathaoEnabled: false,
        courierPathaoCredentials: null
    });

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        const data = await getDeliveryConfig();
        if (data) {
            setConfig(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await updateDeliveryConfig(config);
        if (res.success) {
            toast.success("Delivery settings saved successfully");
            // Reload to ensure all states are synced if needed, mostly for IDs but we are using JSON for dynamic parts
        } else {
            toast.error("Failed to save settings");
        }
        setSaving(false);
    };

    // Weight Based Charges Handlers
    const addWeightCharge = () => {
        setConfig({
            ...config,
            weightBasedCharges: [...(config.weightBasedCharges || []), { min: 0, max: 0, charge: 0 }]
        });
    };

    const updateWeightCharge = (index: number, field: string, value: any) => {
        const newCharges = [...(config.weightBasedCharges || [])];
        newCharges[index] = { ...newCharges[index], [field]: Number(value) };
        setConfig({ ...config, weightBasedCharges: newCharges });
    };

    const removeWeightCharge = (index: number) => {
        const newCharges = [...(config.weightBasedCharges || [])];
        newCharges.splice(index, 1);
        setConfig({ ...config, weightBasedCharges: newCharges });
    };

    // Zone Handlers
    const [newZone, setNewZone] = useState({ name: '', price: 0, type: 'ZONE' });

    const addZone = () => {
        if (!newZone.name) return toast.error("Name is required");
        setConfig({
            ...config,
            deliveryZones: [...(config.deliveryZones || []), {
                id: crypto.randomUUID(),
                name: newZone.name,
                price: Number(newZone.price),
                type: newZone.type,
                codEnabled: true
            }]
        });
        setNewZone({ ...newZone, name: '', price: 0 });
    };

    const removeZone = (id: string) => {
        setConfig({
            ...config,
            deliveryZones: (config.deliveryZones || []).filter((z: any) => z.id !== id)
        });
    };

    const toggleZoneCod = (id: string, val: boolean) => {
        setConfig({
            ...config,
            deliveryZones: (config.deliveryZones || []).map((z: any) =>
                z.id === id ? { ...z, codEnabled: val } : z
            )
        });
    };


    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    const zones = (config.deliveryZones || []).filter((z: any) => z.type === 'ZONE');
    const districts = (config.deliveryZones || []).filter((z: any) => z.type === 'DISTRICT');
    const upazilas = (config.deliveryZones || []).filter((z: any) => z.type === 'UPAZILA');

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header / Banner */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </Button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Delivery Support</h2>
                        <p className="text-sm text-slate-500">Configure your delivery charges and zones</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes or Update
                </Button>
            </div>

            {/* Banner Image Placeholder */}
            <div className="relative w-full h-48 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-sm border border-blue-100 flex items-center justify-center">
                {/* Replace with actual banner if user uploads one, or keep this stylized placeholder */}
                <div className="text-center p-6">
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">বেছে নিন আপনার পছন্দের ডেলিভারি সার্ভিস</h3>
                    <p className="text-blue-400">Manage delivery partners and costs efficiently</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600 transform skew-x-12 translate-x-12 opacity-10"></div>
            </div>

            {/* Default Service Config */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Delivery Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Default Charge */}
                    <div className="space-y-2">
                        <Label>Delivery Charge (Default)</Label>
                        <Input
                            type="number"
                            value={config.defaultCharge}
                            onChange={(e) => setConfig({ ...config, defaultCharge: e.target.value })}
                        />
                        <p className="text-xs text-slate-400">Default delivery charge will be applied to all areas, except for the specific zones listed below.</p>
                    </div>

                    {/* Default COD */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <Label>Enable COD for Default Delivery</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-600">[{config.defaultCodEnabled ? 'YES' : 'NO'}]</span>
                            <Switch
                                checked={config.defaultCodEnabled}
                                onCheckedChange={(c) => setConfig({ ...config, defaultCodEnabled: c })}
                            />
                        </div>
                    </div>

                    {/* Non Refundable */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-800">Delivery Charge not refundable?</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-600">[{config.nonRefundable ? 'YES' : 'NO'}]</span>
                                <Switch
                                    checked={config.nonRefundable}
                                    onCheckedChange={(c) => setConfig({ ...config, nonRefundable: c })}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">Enabling this option ensures if you return a order the delivery charge will not be refunded.</p>
                    </div>

                    {/* Weight Based Charges */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-1">
                            <Label>Weight-Based Extra Charges</Label>
                            <p className="text-xs text-slate-400">Add extra delivery charges based on product weight. For example: 5 kg = ৳50, 10 kg = ৳80</p>
                        </div>

                        {config.weightBasedCharges?.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-2">
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                    <Input
                                        placeholder="Weight (kg)"
                                        type="number"
                                        value={item.min || ''}
                                        onChange={(e) => updateWeightCharge(i, 'min', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Extra Charge"
                                        type="number"
                                        value={item.charge || ''}
                                        onChange={(e) => updateWeightCharge(i, 'charge', e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeWeightCharge(i)} className="text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        <div className="flex gap-4 items-center">
                            <div className="grid grid-cols-2 gap-4 flex-1">
                                <Input disabled placeholder="Weight (in kg)" />
                                <Input disabled placeholder="Extra Charge" />
                            </div>
                            <Button variant="secondary" onClick={addWeightCharge} className="w-24">
                                Add <Plus className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>

                    {/* Specific Zones */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label>Delivery option:</Label>
                            <Tabs value={newZone.type} onValueChange={(v) => setNewZone({ ...newZone, type: v })} className="w-auto">
                                <TabsList>
                                    <TabsTrigger value="ZONE">Zones</TabsTrigger>
                                    <TabsTrigger value="DISTRICT">Districts</TabsTrigger>
                                    <TabsTrigger value="UPAZILA">Upazila/P.S</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-2">
                            <Label>Specific Delivery Charges</Label>

                            {/* List of active zones for current selected type */}
                            <div className="space-y-3">
                                {(newZone.type === 'ZONE' ? zones : newZone.type === 'DISTRICT' ? districts : upazilas).map((z: any) => (
                                    <div key={z.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3 animate-in fade-in">
                                        <div className="flex gap-3">
                                            <Input value={z.name} readOnly className="flex-1 bg-white" />
                                            <Input value={z.price} readOnly className="w-24 bg-white" />
                                            <Button variant="destructive" size="icon" onClick={() => removeZone(z.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-sm font-medium text-slate-700">Enable COD for this zone</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500">[{z.codEnabled ? 'YES' : 'NO'}]</span>
                                                <Switch checked={z.codEnabled} onCheckedChange={(c) => toggleZoneCod(z.id, c)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Zone */}
                            <div className="flex gap-3 pt-2">
                                <Input
                                    className="flex-1" // Use Select for districts/upazilas in future if needed
                                    placeholder={`Select delivery ${newZone.type.toLowerCase()}`}
                                    value={newZone.name}
                                    onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                                />
                                <Input
                                    className="w-24"
                                    placeholder="Price"
                                    type="number"
                                    value={newZone.price || ''}
                                    onChange={(e) => setNewZone({ ...newZone, price: parseInt(e.target.value) || 0 })}
                                />
                                <Button variant="secondary" onClick={addZone} className="w-24">
                                    Add <Plus className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Update Delivery Charges</Button>
                    </div>

                </CardContent>
            </Card>

            {/* Courier Services */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Courier Services</h3>
                <p className="text-sm text-slate-500">Enable and configure your preferred delivery services</p>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center p-2">
                                {/* Pathao Logo Placeholder */}
                                <span className="text-red-600 font-bold text-xs">Pathao</span>
                            </div>
                            <div>
                                <CardTitle className="text-base">Pathao</CardTitle>
                                <CardDescription>Configure delivery credentials</CardDescription>
                            </div>
                        </div>
                        <Switch
                            checked={config.courierPathaoEnabled}
                            onCheckedChange={(c) => setConfig({ ...config, courierPathaoEnabled: c })}
                        />
                    </CardHeader>
                    {config.courierPathaoEnabled && (
                        <CardContent className="p-4 pt-0 border-t bg-slate-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Client ID</Label>
                                    <Input
                                        value={config.courierPathaoCredentials?.client_id || ''}
                                        onChange={(e) => setConfig({ ...config, courierPathaoCredentials: { ...config.courierPathaoCredentials, client_id: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client Secret</Label>
                                    <Input
                                        type="password"
                                        value={config.courierPathaoCredentials?.client_secret || ''}
                                        onChange={(e) => setConfig({ ...config, courierPathaoCredentials: { ...config.courierPathaoCredentials, client_secret: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input
                                        value={config.courierPathaoCredentials?.username || ''}
                                        onChange={(e) => setConfig({ ...config, courierPathaoCredentials: { ...config.courierPathaoCredentials, username: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={config.courierPathaoCredentials?.password || ''}
                                        onChange={(e) => setConfig({ ...config, courierPathaoCredentials: { ...config.courierPathaoCredentials, password: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}

