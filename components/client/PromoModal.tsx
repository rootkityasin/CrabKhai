'use client';

import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm h-[340px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 group">
                {/* Full Background Image */}
                <img
                    src="/images/promo-combo.jpg"
                    alt="Wings & Bomb Combo"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-32" />

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors z-30 border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 text-center">
                    {/* Top Badge */}
                    <div className="absolute top-4 left-0 right-0 flex justify-center">
                        <div className="inline-block px-4 py-1.5 bg-crab-red text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg animate-pulse border border-white/20">
                            Most Popular
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="pb-2">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="text-white/40 line-through text-sm decoration-2">BDT 1320</span>
                            <span className="text-4xl font-black text-crab-red drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(224, 79, 52, 0.5)' }}>
                                <span className="text-lg align-top opacity-80">BDT</span> 1200
                            </span>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-full py-4 bg-white text-crab-red font-black uppercase tracking-widest rounded-xl shadow-xl active:scale-95 transition-all hover:bg-gray-100 flex items-center justify-center gap-2 group/btn"
                        >
                            <Clock className="w-4 h-4 group-hover/btn:animate-spin" />
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
