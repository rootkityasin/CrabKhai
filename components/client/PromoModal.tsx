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
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 group">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-colors z-30"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="relative h-64 w-full">
                    <img
                        src="/images/promo-crab.png"
                        alt="Delicious Crab Combo"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute bottom-4 left-0 w-full text-center p-4">
                        <div className="inline-block px-3 py-1 bg-crab-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2 shadow-lg animate-bounce">
                            Limited Time
                        </div>
                        <h2 className="text-4xl font-heading font-black text-white drop-shadow-xl leading-none">
                            COMBO <br /> <span className="text-sand">OFFER</span>
                        </h2>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 text-center bg-white relative">
                    <p className="text-gray-600 mb-6 font-medium">
                        Enjoy the authentic taste of Sundarban with our exclusive platter.
                        <br />
                        <span className="block mt-2 text-2xl font-bold text-crab-red">
                            FLAT 20% OFF
                        </span>
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-ocean-blue text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all hover:bg-ocean-blue/90 flex items-center justify-center gap-2"
                    >
                        <Clock className="w-4 h-4" />
                        Grab Deal Now
                    </button>

                    <button
                        onClick={handleClose}
                        className="mt-4 text-xs text-gray-400 hover:text-gray-600 font-medium"
                    >
                        No thanks, I'm full
                    </button>
                </div>
            </div>
        </div>
    );
}
