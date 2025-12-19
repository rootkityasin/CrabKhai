'use client';

import { useCartStore } from '@/lib/store';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeItem, addItem, clearCart, total } = useCartStore();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const handleQuantityChange = (item: any, change: number) => {
        if (change === -1 && item.quantity === 1) {
            removeItem(item.id);
        } else {
            addItem({ ...item, quantity: change });
        }
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send directly to an API
        console.log('Order Placed:', { items, total: total(), customer: formData });

        // Simulate Success
        setIsOrderPlaced(true);
        setTimeout(() => {
            clearCart();
        }, 100);
    };

    if (isOrderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-3xl font-heading font-bold text-ocean-blue mb-2">Order Received!</h2>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Thanks {formData.name}, we're getting your fresh seafood ready. We'll call you at {formData.phone} shortly.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-crab-red text-white font-bold rounded-xl shadow-lg hover:bg-crab-red/90 transition-all"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🦀</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any delicious crabs yet.</p>
                <Link
                    href="/menu"
                    className="px-8 py-3 bg-ocean-blue text-white font-bold rounded-xl shadow-lg hover:bg-ocean-blue/90 transition-all"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 pb-32 animate-in slide-in-from-right duration-300">
            <h1 className="text-2xl font-heading font-bold text-ocean-blue mb-6">Your Bag</h1>

            {/* Cart Items List */}
            <div className="space-y-4 mb-8">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        {/* Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">Img</div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-crab-red font-bold">৳{item.price * item.quantity}</span>

                                {/* Quantity Control */}
                                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 active:scale-95"
                                        onClick={() => handleQuantityChange(item, -1)}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-crab-red text-white rounded-full shadow-sm active:scale-95"
                                        onClick={() => handleQuantityChange(item, 1)}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Summary */}
            <div className="bg-sand/20 p-4 rounded-xl mb-8 border border-sand/30">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-gray-900">৳{total()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-bold text-gray-900">৳60</span>
                </div>
                <div className="my-2 border-t border-gray-300/50"></div>
                <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-ocean-blue">Total</span>
                    <span className="font-black text-crab-red">৳{total() + 60}</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-ocean-blue mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-ocean-blue text-white text-xs flex items-center justify-center">1</span>
                    Delivery Details
                </h2>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Your Name"
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                        <input
                            required
                            type="tel"
                            placeholder="017..."
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
                        <textarea
                            required
                            placeholder="House, Road, Area..."
                            rows={2}
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all resize-none"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-crab-red text-white font-black text-lg uppercase tracking-widest rounded-xl shadow-xl active:scale-95 transition-all hover:bg-crab-red/90 flex items-center justify-center gap-2 mt-6"
                    >
                        <span>Confirm Order</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
