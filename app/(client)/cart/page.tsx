'use client';

import { useCartStore } from '@/lib/store';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';

export default function CartPage() {
    const { items, removeItem, addItem, clearCart, total } = useCartStore();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        area: '',
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

        setIsAnimating(true);

        // Calculate Points (1 point per 100 Taka)
        const pointsEarned = Math.floor(total() / 100);

        // Update User Points in LocalStorage if logged in
        const storedUser = localStorage.getItem('crabkhai_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const newPoints = (user.points || 0) + pointsEarned;

            // Determine Status
            let newStatus = 'Bronze';
            if (newPoints >= 500) newStatus = 'Gold';
            else if (newPoints >= 100) newStatus = 'Silver';

            const updatedUser = { ...user, points: newPoints, status: newStatus };
            localStorage.setItem('crabkhai_user', JSON.stringify(updatedUser));
        }

        // Simulate Success
        // Simulate Success
        setTimeout(() => {
            setIsOrderPlaced(true);
            setIsAnimating(false);
            clearCart();
        }, 4000); // 4 second delay to show animation
    };

    // Translation Hook
    const { language } = useLanguageStore();
    // Use type assertion to avoid transient typescript error while keys propagate
    const t = translations[language] as any;
    const fontClass = language !== 'en' ? 'font-bangla' : 'font-body';
    const headingClass = language !== 'en' ? 'font-bangla' : 'font-heading';

    if (isOrderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🎉</span>
                </div>
                <h2 className={`text-3xl font-bold text-ocean-blue mb-2 ${headingClass}`}>{t.cartPage.orderReceived}</h2>
                <p className={`text-gray-500 mb-8 max-w-xs mx-auto ${fontClass}`}>
                    We'll call you shortly at {formData.phone}.
                </p>
                <Link
                    href="/"
                    className={`px-8 py-3 bg-crab-red text-white font-bold rounded-xl shadow-lg hover:bg-crab-red/90 transition-all ${fontClass}`}
                >
                    {t.cartPage.backHome}
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100dvh-80px)] w-full p-4 text-center animate-in fade-in zoom-in duration-700 relative bg-white overflow-hidden">

                <h2 className={`text-3xl md:text-4xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight ${headingClass}`}>
                    {t.cartPage.emptyTitle}
                </h2>
                <p className={`text-base md:text-lg text-gray-500 mb-2 md:mb-10 max-w-sm mx-auto leading-relaxed font-medium ${fontClass}`}>
                    {t.cartPage.emptyMessage}
                </p>

                <div className="w-full max-w-[450px] h-auto max-h-[40vh] aspect-square mb-2 flex items-center justify-center relative">
                    <img
                        src="/mascot/empty-cart-final.gif"
                        alt="Empty Cart"
                        className="w-full h-full object-contain"
                    />
                </div>

                <Link
                    href="/menu"
                    className={`relative group px-10 md:px-12 py-4 md:py-5 mt-4 md:mt-8 bg-gradient-to-r from-crab-red to-orange-600 text-white text-lg md:text-xl font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-crab-red/30 hover:shadow-crab-red/40 active:scale-95 transition-all overflow-hidden ${fontClass}`}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {t.cartPage.browseMenu}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 pb-32 max-w-lg mx-auto">
            <h1 className={`text-2xl font-bold mb-6 ${headingClass}`}>{t.cartPage.title}</h1>

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
                    <span className="text-gray-600">{t.cartPage.subtotal}</span>
                    <span className="font-bold text-gray-900">৳{total()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{t.cartPage.deliveryFee}</span>
                    <span className="font-bold text-gray-900">৳60</span>
                </div>
                <div className="my-2 border-t border-gray-300/50"></div>
                <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-ocean-blue">{t.cartPage.total}</span>
                    <span className="font-black text-crab-red">৳{total() + 60}</span>
                </div>
            </div>

            {/* Checkout Form */}
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                <h2 className={`text-lg font-bold text-ocean-blue mb-4 flex items-center gap-2 ${headingClass}`}>
                    <span className="w-6 h-6 rounded-full bg-ocean-blue text-white text-xs flex items-center justify-center">1</span>
                    {t.cartPage.deliveryDetails}
                </h2>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.cartPage.name}</label>
                        <input
                            required
                            type="text"
                            placeholder={t.cartPage.name}
                            className={`w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all ${fontClass}`}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.cartPage.phone}</label>
                        <input
                            required
                            type="tel"
                            placeholder="017..."
                            className={`w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all ${fontClass}`}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.cartPage.area}</label>
                        <select
                            required
                            className={`w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all appearance-none ${fontClass}`}
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        >
                            <option value="">{t.cartPage.selectArea}</option>
                            {['Dhaka', 'Khulna', 'Chattogram'].map((area) => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.cartPage.address}</label>
                        <textarea
                            required
                            placeholder={t.cartPage.address}
                            rows={2}
                            className={`w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-crab-red/20 focus:border-crab-red transition-all resize-none ${fontClass}`}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isAnimating}
                        className={`w-full py-4 font-black text-lg uppercase tracking-widest rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 ${fontClass} relative overflow-hidden ${isAnimating ? 'bg-white' : 'bg-crab-red text-white hover:bg-crab-red/90'}`}
                    >
                        {isAnimating ? (
                            <motion.img
                                src="/mascot/pose-delivery-cleaned.gif"
                                alt="Processing..."
                                initial={{ x: '-150%' }}
                                animate={{ x: '150%' }}
                                transition={{ duration: 4, ease: "linear" }}
                                className="h-16 w-auto object-contain"
                            />
                        ) : (
                            <>
                                <span>{t.cartPage.confirmOrder}</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
