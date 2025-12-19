'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Ticket, Copy, Trash2, Plus, X, Calendar } from 'lucide-react';

const initialPromos = [
    { id: 1, code: 'CRAB100', discount: 100, min: 1000, expire: '2024-10-20' },
    { id: 2, code: 'FIRST50', discount: 50, min: 500, expire: '2024-12-31' },
];

export default function PromoPage() {
    const [promos, setPromos] = useState(initialPromos);
    const [isAdding, setIsAdding] = useState(false);
    const [newPromo, setNewPromo] = useState({ code: '', discount: 0, min: 0, expire: '' });

    const handleDelete = (id: number) => {
        if (confirm('Delete this promo code?')) {
            setPromos(promos.filter(p => p.id !== id));
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPromo.code) return;

        const promo = {
            id: Date.now(),
            ...newPromo
        };

        setPromos([...promos, promo]);
        setIsAdding(false);
        setNewPromo({ code: '', discount: 0, min: 0, expire: '' });
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Promo Codes</h1>
                    <p className="text-sm text-slate-500">Manage discounts and coupons.</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create Coupon
                </Button>
            </div>

            {/* Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">New Promo Code</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Code (Uppercase)</label>
                                    <Input
                                        placeholder="e.g. CRABLOVER"
                                        value={newPromo.code}
                                        onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                                        className="uppercase font-mono"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Discount (৳)</label>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            value={newPromo.discount}
                                            onChange={(e) => setNewPromo({ ...newPromo, discount: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Min Order</label>
                                        <Input
                                            type="number"
                                            placeholder="500"
                                            value={newPromo.min}
                                            onChange={(e) => setNewPromo({ ...newPromo, min: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                                    <Input
                                        type="date"
                                        value={newPromo.expire}
                                        onChange={(e) => setNewPromo({ ...newPromo, expire: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">Create Code</Button>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promos.map((promo) => (
                    <Card key={promo.id} className="p-6 border-dashed border-2 border-orange-200 bg-orange-50/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 bg-orange-100 rounded-bl-xl text-orange-600">
                            <Ticket className="w-5 h-5" />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-800 mb-1">৳{promo.discount} OFF</h2>
                        <p className="text-sm text-slate-500 mb-4">Min. purchase ৳{promo.min}</p>

                        <div className="bg-white p-3 rounded border border-orange-100 flex justify-between items-center shadow-sm">
                            <code className="font-mono font-bold text-orange-600 text-lg tracking-widest">{promo.code}</code>
                            <button
                                onClick={() => { navigator.clipboard.writeText(promo.code); alert('Code copied!'); }}
                                className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {promo.expire}</span>
                            <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Delete
                            </button>
                        </div>
                    </Card>
                ))}
                {promos.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-gray-200 rounded-lg">
                        No active promo codes.
                    </div>
                )}
            </div>
        </div>
    );
}
