'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Copy, Trash2, Plus, X, Calendar, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

const initialPromos = [
    { id: 1, code: 'CRAB100', discount: 100, min: 1000, expire: '2024-10-20' },
    { id: 2, code: 'FIRST50', discount: 50, min: 500, expire: '2024-12-31' },
];

const initialPromoCards = [
    { id: '1', title: 'Winter Sale', description: 'Get 50% off on all items!', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000', isActive: true },
];

export default function PromoPage() {
    const [promos, setPromos] = useState(initialPromos);
    const [promoCards, setPromoCards] = useState(initialPromoCards);

    // Coupon State
    const [isAddingCoupon, setIsAddingCoupon] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: 0, min: 0, expire: '' });

    // Promo Card State
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCard, setNewCard] = useState({ title: '', description: '', imageUrl: '', isActive: true });

    // Coupon Handlers
    const handleDeleteCoupon = (id: number) => {
        if (confirm('Delete this promo code?')) {
            setPromos(promos.filter(p => p.id !== id));
        }
    };

    const handleAddCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCoupon.code) return;
        setPromos([...promos, { id: Date.now(), ...newCoupon }]);
        setIsAddingCoupon(false);
        setNewCoupon({ code: '', discount: 0, min: 0, expire: '' });
    };

    // Promo Card Handlers
    const handleDeleteCard = (id: string) => {
        if (confirm('Delete this promo card?')) {
            setPromoCards(promoCards.filter(p => p.id !== id));
        }
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        setPromoCards([...promoCards, { id: Date.now().toString(), ...newCard }]);
        setIsAddingCard(false);
        setNewCard({ title: '', description: '', imageUrl: '', isActive: true });
    };

    const toggleCardStatus = (id: string) => {
        setPromoCards(promoCards.map(card => card.id === id ? { ...card, isActive: !card.isActive } : card));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Promotions</h1>
                    <p className="text-sm text-slate-500">Manage coupons and website popups.</p>
                </div>
            </div>

            <Tabs defaultValue="coupons" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="coupons">Coupons</TabsTrigger>
                    <TabsTrigger value="popups">Website Popups</TabsTrigger>
                </TabsList>

                {/* COUPONS TAB */}
                <TabsContent value="coupons" className="mt-6 space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => setIsAddingCoupon(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Create Coupon
                        </Button>
                    </div>

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
                                    <button onClick={() => { navigator.clipboard.writeText(promo.code); alert('Code copied!'); }} className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {promo.expire}</span>
                                    <button onClick={() => handleDeleteCoupon(promo.id)} className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* POPUPS TAB */}
                <TabsContent value="popups" className="mt-6 space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => setIsAddingCard(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Create Popup
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promoCards.map((card) => (
                            <Card key={card.id} className="overflow-hidden group relative flex flex-col h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative h-48 bg-slate-100">
                                    <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2">
                                        <Badge className={`${card.isActive ? 'bg-green-500' : 'bg-slate-400'} text-white border-none shadow-sm`}>
                                            {card.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">{card.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{card.description}</p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={card.isActive}
                                                onCheckedChange={() => toggleCardStatus(card.id)}
                                            />
                                            <span className="text-xs text-slate-500">{card.isActive ? 'On' : 'Off'}</span>
                                        </div>
                                        <button onClick={() => handleDeleteCard(card.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {promoCards.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
                                <p>No active promo popups.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* ADD COUPON MODAL */}
            {isAddingCoupon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">New Coupon</h2>
                            <button onClick={() => setIsAddingCoupon(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleAddCoupon} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Code</Label>
                                <Input placeholder="e.g. SUMMER25" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Discount (৳)</Label>
                                    <Input type="number" value={newCoupon.discount} onChange={e => setNewCoupon({ ...newCoupon, discount: +e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Min Order (৳)</Label>
                                    <Input type="number" value={newCoupon.min} onChange={e => setNewCoupon({ ...newCoupon, min: +e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Expires</Label>
                                <Input type="date" value={newCoupon.expire} onChange={e => setNewCoupon({ ...newCoupon, expire: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Create Coupon</Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* ADD POPUP MODAL */}
            {isAddingCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">New Website Popup</h2>
                            <button onClick={() => setIsAddingCard(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input placeholder="e.g. Winter Flash Sale!" value={newCard.title} onChange={e => setNewCard({ ...newCard, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Short description..." value={newCard.description} onChange={e => setNewCard({ ...newCard, description: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Image</Label>
                                <ImageUpload
                                    value={newCard.imageUrl}
                                    onChange={(url) => setNewCard({ ...newCard, imageUrl: url })}
                                    onRemove={() => setNewCard({ ...newCard, imageUrl: '' })}
                                    recommendedSize="600x600 (Square or Portrait)"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <Switch checked={newCard.isActive} onCheckedChange={c => setNewCard({ ...newCard, isActive: c })} />
                                <Label>Active Immediately</Label>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-2">Create Popup</Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
