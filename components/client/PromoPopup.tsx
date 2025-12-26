'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Mock data for now, ideally this comes from a server action or API
const activePromo = {
    id: '1',
    title: 'Winter Sale',
    description: 'Get 50% off on all items! Limited time offer.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000',
    isActive: true
};

export default function PromoPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the promo has been dismissed recently
        const dismissed = localStorage.getItem(`promo_dismissed_${activePromo.id}`);
        if (!dismissed && activePromo.isActive) {
            // Show after a small delay
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(`promo_dismissed_${activePromo.id}`, 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
                        className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative h-56 md:h-64">
                            <img src={activePromo.imageUrl} alt={activePromo.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-6 right-6 text-white">
                                <h2 className="text-2xl font-bold mb-1 leading-tight">{activePromo.title}</h2>
                            </div>
                        </div>

                        <div className="p-6 pt-4 bg-white">
                            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                {activePromo.description}
                            </p>

                            <div className="flex gap-3">
                                <Button onClick={handleDismiss} variant="outline" className="flex-1 border-slate-200">
                                    Close
                                </Button>
                                <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                                    Check it out
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
