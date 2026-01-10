'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Flame, Activity, Timer, Utensils, X, ShoppingBag, ChevronLeft, ChevronRight, Info, ZoomIn } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/components/providers/AdminProvider';

const AnimatedCounter = ({ value }: { value: string | number }) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => {
        if (isNaN(numericValue)) return String(value);
        const isFloat = numericValue % 1 !== 0;
        return current.toFixed(isFloat ? 2 : 0);
    });

    React.useEffect(() => {
        if (!isNaN(numericValue)) {
            spring.set(numericValue);
        }
    }, [spring, numericValue]);

    if (isNaN(numericValue)) return <span>{value}</span>;

    return <motion.span>{display}</motion.span>;
};

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        name: string;
        price: string | number;
        image: string;
        images?: string[];
        nutritionImage?: string;
        cookingImage?: string;
        nutrition?: string;
        cookingInstructions?: string;
        totalSold?: number;
        weightOptions?: string[];
    };
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { settings } = useAdmin();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(product.weightOptions?.[0] || 'Standard');

    // Gallery State
    // Gallery State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

    React.useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setSelectedVariant(product.weightOptions?.[0] || 'Standard');
            setCurrentImageIndex(0);
        }
    }, [isOpen, product.weightOptions]);

    // Auto-scroll Gallery
    // Auto-scroll Gallery
    React.useEffect(() => {
        if (galleryImages.length <= 1 || isPaused) return; // Stop if paused
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [galleryImages.length, isPaused]);

    const handleAddToCart = () => {
        const priceNum = typeof product.price === 'string'
            ? Number(product.price.replace(/[^0-9.]/g, ''))
            : product.price;

        addItem({
            id: product.id,
            name: `${product.name} - ${selectedVariant}`,
            price: priceNum,
            image: product.image,
            quantity: quantity
        });
        toast.success(`Added ${quantity} x ${selectedVariant} to cart!`);
        onClose();
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl h-[85vh] flex flex-col">
                <DialogTitle className="sr-only">{product.name} Details</DialogTitle>

                {/* Hero Gallery Section */}
                <div className="relative h-[250px] bg-slate-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[60] p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image Carousel */}
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.img
                            key={currentImageIndex}
                            src={galleryImages[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setIsZoomed(true)}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onTouchStart={() => setIsPaused(true)}
                            onTouchEnd={() => setIsPaused(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    {galleryImages.length > 1 && (
                        <>
                            {/* Dots */}
                            <div className="absolute bottom-6 right-6 z-30 flex items-center justify-center gap-1.5 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 shadow-lg">
                                {galleryImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`transition-all duration-300 rounded-full ${idx === currentImageIndex
                                            ? 'bg-white w-4 h-1.5 shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                                            : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/80'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Gradient Overlay (Only minimal for depth) */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    {/* Zoom Hint Button */}
                    <button
                        onClick={() => setIsZoomed(true)}
                        className="absolute bottom-4 right-4 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>

                {/* Full Screen Zoom Overlay */}
                <AnimatePresence>
                    {isZoomed && (
                        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
                            <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[95vh] !max-h-[95vh] !p-0 !bg-transparent !border-none !shadow-none flex items-center justify-center outline-none">
                                <DialogTitle className="sr-only">Zoomed Image: {product.name}</DialogTitle>
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <button
                                        onClick={() => setIsZoomed(false)}
                                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md"
                                    >
                                        <X className="w-8 h-8" />
                                    </button>
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        src={galleryImages[currentImageIndex]}
                                        alt="Zoomed Product"
                                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                                        onClick={() => setIsZoomed(false)}
                                        onMouseEnter={() => setIsPaused(true)}
                                        onMouseLeave={() => setIsPaused(false)}
                                        onTouchStart={() => setIsPaused(true)}
                                        onTouchEnd={() => setIsPaused(false)}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 bg-white relative z-10 overflow-hidden">
                    <div className="px-6 pt-5 pb-2">
                        <h2 className="text-xl font-heading font-bold text-slate-900 leading-tight">{product.name}</h2>
                        <p className="text-slate-500 mt-1.5 text-xs leading-relaxed font-medium">
                            Sustainably sourced, fresh soft shell crab. Cleaned and processed for immediate cooking.
                        </p>
                    </div>

                    <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                        <TabsList className="w-full justify-start rounded-none border-b bg-white p-0 h-auto shrink-0 z-20 relative px-6">
                            <TabsTrigger
                                value="overview"
                                className="flex-1 !outline-none !ring-0 !ring-offset-0 !shadow-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!outline-none focus:!outline-none data-[state=active]:bg-transparent data-[state=active]:!shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600 rounded-none py-3.5 text-slate-500 data-[state=active]:text-red-600 font-bold transition-all"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="cooking"
                                className="flex-1 !outline-none !ring-0 !ring-offset-0 !shadow-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!outline-none focus:!outline-none data-[state=active]:bg-transparent data-[state=active]:!shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none py-3.5 text-slate-500 data-[state=active]:text-orange-600 font-bold transition-all"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Flame className="w-3.5 h-3.5" /> Cooking
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="nutrition"
                                className="flex-1 !outline-none !ring-0 !ring-offset-0 !shadow-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!outline-none focus:!outline-none data-[state=active]:bg-transparent data-[state=active]:!shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none py-3.5 text-slate-500 data-[state=active]:text-green-600 font-bold transition-all"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5" /> Nutrition
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-0 flex-1 bg-slate-50/50 overflow-hidden relative">
                            <AnimatePresence mode="wait">

                                <TabsContent key="overview" value="overview" className="mt-0 space-y-4 focus-visible:ring-0 absolute inset-0 p-4 md:p-6 pb-24 overflow-y-auto">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        {/* Total Sold Badge */}
                                        {product.totalSold && (
                                            <div className="flex justify-start">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 shadow-sm">
                                                    <Activity className="w-3 h-3 mr-1" />
                                                    {product.totalSold} Total Sold
                                                </span>
                                            </div>
                                        )}

                                        {/* Variant Selector */}
                                        {product.weightOptions && product.weightOptions.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Select Weight</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.weightOptions.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => setSelectedVariant(opt)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-full text-sm font-medium transition-all border-2",
                                                                selectedVariant === opt
                                                                    ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                                                                    : "border-gray-200 bg-white text-slate-600 hover:border-gray-300"
                                                            )}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    </motion.div>
                                </TabsContent>

                                <TabsContent key="cooking" value="cooking" className="mt-0 space-y-3 focus-visible:ring-0 absolute inset-0 p-4 md:p-6 pb-24 overflow-y-auto">
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Constant (Default) Cooking Cards */}
                                        <motion.div
                                            className="space-y-3"
                                            variants={{
                                                hidden: { opacity: 0 },
                                                show: {
                                                    opacity: 1,
                                                    transition: { staggerChildren: 0.15 }
                                                }
                                            }}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            {/* Deep Fry Card */}
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    show: { opacity: 1, y: 0 }
                                                }}
                                                whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-orange-100 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0" />
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <div className="p-2 md:p-3 bg-orange-100 rounded-lg text-orange-600 shadow-sm relative overflow-hidden">
                                                            <Flame className="w-5 h-5 md:w-6 md:h-6 fill-orange-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-base md:text-lg leading-tight">Deep Fry</h4>
                                                            <p className="text-xs md:text-sm text-slate-500 font-medium">BEST RESULT</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1 justify-end">
                                                            <span className="text-xl md:text-2xl font-bold text-slate-900">5-6</span>
                                                            <span className="text-xs md:text-sm text-slate-500">min</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] md:text-xs text-green-600 font-medium mt-1">
                                                            <Timer className="w-3 h-3" /> Quick Clean
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            {/* Oven Bake Card */}
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    show: { opacity: 1, y: 0 }
                                                }}
                                                whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-blue-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-blue-600">
                                                            <Utensils className="w-5 h-5 md:w-6 md:h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-base md:text-lg leading-tight">Oven Bake</h4>
                                                            <p className="text-xs md:text-sm text-slate-500">Low Oil Option</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1 justify-end">
                                                            <span className="text-xl md:text-2xl font-bold text-slate-900">10-12</span>
                                                            <span className="text-xs md:text-sm text-slate-500">min</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent key="nutrition" value="nutrition" className="mt-0 focus-visible:ring-0 absolute inset-0 p-4 md:p-6 pb-24 overflow-y-auto">
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                                            {(function () {
                                                // Constant (Default) Items for consistency
                                                const defaultItems = [
                                                    { label: "Energy", value: "125", unit: "kcal", color: "text-amber-600", bg: "bg-amber-50" },
                                                    { label: "Protein", value: "9.38", unit: "g", color: "text-blue-600", bg: "bg-blue-50" },
                                                    { label: "Carbs", value: "19.79", unit: "g", color: "text-emerald-600", bg: "bg-emerald-50" },
                                                    { label: "Fat", value: "1.04", unit: "g", color: "text-rose-600", bg: "bg-rose-50" },
                                                    { label: "Sodium", value: "343", unit: "mg", color: "text-slate-600", bg: "bg-slate-100" },
                                                    { label: "Cholesterol", value: "31.25", unit: "mg", color: "text-slate-600", bg: "bg-slate-100" },
                                                ];

                                                // Always use default items to ensure 'constant' look
                                                const itemsToRender = defaultItems;

                                                const container = {
                                                    hidden: { opacity: 0 },
                                                    show: {
                                                        opacity: 1,
                                                        transition: {
                                                            staggerChildren: 0.1
                                                        }
                                                    }
                                                };

                                                const itemAnim = {
                                                    hidden: { opacity: 0, y: 20 },
                                                    show: { opacity: 1, y: 0 }
                                                };

                                                return (
                                                    <motion.div
                                                        className="grid grid-cols-2 gap-4 col-span-2"
                                                        variants={container}
                                                        initial="hidden"
                                                        animate="show"
                                                    >
                                                        {itemsToRender.map((item, i) => (
                                                            <motion.div
                                                                key={i}
                                                                variants={itemAnim}
                                                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                                            >
                                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{item.label}</p>
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className={`text-2xl font-bold ${item.color}`}>
                                                                        <AnimatedCounter value={item.value} />
                                                                    </span>
                                                                    <span className="text-sm text-slate-500 font-medium">{item.unit}</span>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                );
                                            })()}
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            </AnimatePresence>
                        </div>
                    </Tabs>

                    <div className="p-4 border-t border-white/20 bg-white/50 backdrop-blur-sm flex items-center gap-3 absolute bottom-0 left-0 right-0 z-50">
                        {/* Sticky Quantity Stepper */}
                        <div className="flex items-center bg-white rounded-xl h-12 border border-gray-200 shadow-sm px-1 min-w-[140px]">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-red-600 active:scale-90 transition-transform"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <div className="w-24 flex justify-center font-bold text-lg text-slate-900">
                                {(() => {
                                    const unit = settings.measurementUnit || 'PCS';
                                    if (unit === 'VOLUME') return `${quantity} Ltr`;
                                    if (unit === 'WEIGHT') {
                                        const totalWeight = quantity * 200;
                                        return totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(1)} kg` : `${totalWeight} g`;
                                    }
                                    return quantity;
                                })()}
                            </div>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-red-600 active:scale-90 transition-transform"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            className="flex-1 h-12 text-lg bg-[#F40000] hover:bg-[#D90000] text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all font-bold border-t-2 border-white/20 border-b-4 border-[#B00000] active:border-b-0 active:translate-y-1 active:mt-1 relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEF08A]/40 to-transparent -translate-x-full group-hover:animate-shine" />
                            <div className="flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5 stroke-[3] text-white group-hover:text-[#FEF08A] transition-colors" />
                                <span className="tracking-wide">Add to Cart</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
