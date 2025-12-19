'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Flame } from 'lucide-react';

export function PromoModal() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already seen the offer
        const hasSeenPromo = localStorage.getItem('hasSeenPromo');

        if (!hasSeenPromo) {
            // Show popup after a short delay (e.g., 2 seconds)
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenPromo', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-crab-red/10 -skew-y-6 transform origin-top-left scale-150" />

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white text-gray-500 hover:text-crab-red transition-colors z-20 shadow-sm"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-crab-red rounded-full mb-4 shadow-inner">
                        <Flame className="w-8 h-8 animate-pulse" />
                    </div>

                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                        Combo Offer!
                    </h2>

                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        Get <span className="font-bold text-crab-red">20% OFF</span> on your first Family Platter order. Authentic taste of Sundarban awaits!
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-6 text-xs font-bold text-ocean-blue bg-blue-50 py-2 rounded-lg border border-blue-100">
                        <Clock className="w-4 h-4" />
                        <span>HURRY UP! OFFER ENDS SOON</span>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-crab-red text-white font-bold rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all hover:bg-red-700"
                    >
                        Claim Offer Now
                    </button>

                    <button
                        onClick={handleClose}
                        className="mt-3 text-xs text-gray-400 font-medium hover:text-gray-600"
                    >
                        No thanks, I hate savings
                    </button>
                </div>
            </div>
        </div>
    );
}
