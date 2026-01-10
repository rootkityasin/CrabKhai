'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/components/providers/AdminProvider';
import { useEffect, useState } from 'react';

import { CouponSection } from '@/components/client/CouponSection';

export function CartDrawer() {
    const { items, removeItem, addItem, isOpen, closeCart, total, discount, finalTotal, coupon } = useCartStore();
    const { settings } = useAdmin();
    const [mounted, setMounted] = useState(false);

    // Logic for variables
    const subTotal = total();
    const discountVal = discount();
    const finalVal = finalTotal();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const handleQuantityChange = (item: any, change: number) => {
        if (change === -1 && item.quantity === 1) {
            removeItem(item.id);
        } else {
            addItem({ ...item, quantity: change });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1000] flex flex-col border-l border-white/20"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-crab-red" />
                                <h2 className="text-xl font-bold font-heading text-gray-900">Your Cart</h2>
                                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-crab-red font-bold text-sm hover:underline"
                                    >
                                        Browse Menu
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="flex gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <span className="font-bold text-crab-red text-sm">
                                                    ৳{item.price * item.quantity}
                                                </span>

                                                {/* Stepper */}
                                                <div className="flex items-center gap-2 bg-gray-50 rounded-full px-1.5 py-1 border border-gray-100">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, -1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-red-500 active:scale-95 transition-all"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-900 text-white rounded-full shadow-sm hover:bg-crab-red active:scale-95 transition-all"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-5 bg-white border-t border-gray-100 sticky bottom-0 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                                {/* Coupon Section */}
                                <CouponSection />

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-gray-500 text-sm">
                                        <span>Subtotal</span>
                                        <span>৳{subTotal}</span>
                                    </div>

                                    {discountVal > 0 && (
                                        <div className="flex justify-between items-center text-green-600 text-sm font-medium">
                                            <span>Discount {coupon?.code && `(${coupon.code})`}</span>
                                            <span>-৳{discountVal}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className="text-gray-900 font-bold">Total</span>
                                        <span className="text-xl font-bold text-crab-red">৳{finalVal}</span>
                                    </div>
                                </div>

                                <Link href="/cart" onClick={closeCart}>
                                    <button className="w-full py-4 bg-crab-red text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Checkout Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Add Custom Shine Animation to global css or via tailwind config if not exists
// But here I used standard class, might need to rely on 'group-hover:translate-x-full' transition manually if animation keyframes aren't defined.
// Actually existing buttons used 'animate-shine'. Assuming it exists.
