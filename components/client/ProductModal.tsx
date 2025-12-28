'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Flame, Activity, Timer, Utensils, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import React from 'react';

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
        nutritionImage?: string;
        cookingImage?: string;
        nutrition?: string;
        cookingInstructions?: string;
    };
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        const priceNum = typeof product.price === 'string'
            ? Number(product.price.replace(/[^0-9.]/g, ''))
            : product.price;

        addItem({
            id: product.id,
            name: product.name,
            price: priceNum,
            image: product.image,
            quantity: 1
        });
        toast.success("Added to cart!");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl h-[70vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[60] p-2 bg-black/10 hover:bg-black/20 rounded-full text-slate-800 transition-colors backdrop-blur-sm"
                >
                    <X className="w-6 h-6" />
                </button>
                {/* Background Image for Atmosphere */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={product.image}
                        alt="Background"
                        className="w-full h-full object-cover opacity-100 scale-105"
                    />
                </div>
                <div className="flex flex-col h-full relative z-10">

                    {/* Main Content Area */}
                    <div className="w-full flex flex-col flex-1 backdrop-blur-[3px] h-full">
                        <div className="p-6 border-b border-gray-100">
                            <DialogHeader className="mb-0 text-left">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">{product.name}</DialogTitle>
                                </motion.div>
                                <motion.p
                                    className="text-slate-500 mt-1 text-sm leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Sustainably sourced, fresh soft shell crab. Cleaned and processed for immediate cooking.
                                </motion.p>
                            </DialogHeader>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <Tabs defaultValue="cooking" className="w-full h-full flex flex-col">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                                    {/* ... triggers unchanged ... */}
                                    <TabsTrigger
                                        value="cooking"
                                        className="!outline-none !ring-0 !ring-offset-0 !shadow-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!outline-none focus:!outline-none data-[state=active]:bg-transparent data-[state=active]:!shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none px-6 py-4 text-slate-500 data-[state=active]:text-orange-600 font-medium transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-4 h-4" /> Cooking Guide
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="nutrition"
                                        className="!outline-none !ring-0 !ring-offset-0 !shadow-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!outline-none focus:!outline-none data-[state=active]:bg-transparent data-[state=active]:!shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-6 py-4 text-slate-500 data-[state=active]:text-green-600 font-medium transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4" /> Nutrition
                                        </div>
                                    </TabsTrigger>
                                </TabsList>

                                <div className="p-6 flex-1 bg-slate-50/50 overflow-hidden relative">
                                    <AnimatePresence mode="wait">

                                        <TabsContent key="cooking" value="cooking" className="mt-0 space-y-4 focus-visible:ring-0 absolute inset-0 p-6 overflow-y-auto">
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {/* Constant (Default) Cooking Cards */}
                                                <motion.div
                                                    className="space-y-4"
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
                                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                        className="bg-white rounded-xl p-5 shadow-sm border border-orange-100 relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0" />
                                                        <div className="relative z-10 flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-sm relative overflow-hidden">
                                                                    <Flame className="w-6 h-6 fill-orange-600" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800 text-lg">Deep Fry</h4>
                                                                    <p className="text-sm text-slate-500 font-medium">BEST RESULT</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="flex items-baseline gap-1 justify-end">
                                                                    <span className="text-2xl font-bold text-slate-900">5-6</span>
                                                                    <span className="text-sm text-slate-500">min</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
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
                                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                        className="bg-white rounded-xl p-5 shadow-sm border border-blue-50"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                                                    <Utensils className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800 text-lg">Oven Bake</h4>
                                                                    <p className="text-sm text-slate-500">Low Oil Option</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="flex items-baseline gap-1 justify-end">
                                                                    <span className="text-2xl font-bold text-slate-900">10-12</span>
                                                                    <span className="text-sm text-slate-500">min</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            </motion.div>
                                        </TabsContent>

                                        <TabsContent key="nutrition" value="nutrition" className="mt-0 focus-visible:ring-0 absolute inset-0 p-6 overflow-y-auto">
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <div className="p-4 border-t border-white/20 bg-white/30">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full h-14 text-xl bg-[#F40000] hover:bg-[#D90000] text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all font-bold border-t-2 border-white/20 border-b-4 border-[#B00000] active:border-b-0 active:translate-y-1 active:mt-1 relative overflow-hidden group"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FEF08A]/40 to-transparent -translate-x-full group-hover:animate-shine" />
                                <div className="flex items-center justify-center gap-3">
                                    <Plus className="w-6 h-6 stroke-[3] text-white group-hover:text-[#FEF08A] transition-colors" />
                                    <span className="tracking-wide">Add to Cart</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
