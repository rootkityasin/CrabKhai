'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Flame, Activity, Timer, Utensils } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
                <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                    {/* Left Side: Product Image Showcase */}
                    <div className="w-full md:w-5/12 relative bg-slate-50 flex items-center justify-center p-8 overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-50/50 to-transparent" />
                        <motion.img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-auto object-contain z-10 drop-shadow-xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent text-white z-20">
                            <p className="font-medium opacity-90">Premium Quality</p>
                            <p className="text-3xl font-bold">৳{product.price}</p>
                        </div>
                    </div>

                    {/* Right Side: Details & Tabs */}
                    <div className="w-full md:w-7/12 flex flex-col bg-white">
                        <div className="p-6 border-b border-gray-100">
                            <DialogHeader className="mb-0 text-left">
                                <DialogTitle className="text-3xl font-bold text-slate-900 tracking-tight">{product.name}</DialogTitle>
                                <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                                    Sustainably sourced, fresh soft shell crab. Cleaned and processed for immediate cooking.
                                </p>
                            </DialogHeader>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <Tabs defaultValue="cooking" className="w-full h-full flex flex-col">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
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

                                <div className="p-6 flex-1 bg-slate-50/50">
                                    <TabsContent value="cooking" className="mt-0 space-y-4 focus-visible:ring-0">
                                        {/* Deep Fry Card */}
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="bg-white rounded-xl p-5 shadow-sm border border-orange-100 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0" />
                                            <div className="relative z-10 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-orange-100 rounded-lg text-orange-600 shadow-sm relative overflow-hidden">
                                                        <motion.div
                                                            animate={{
                                                                scale: [1, 1.2, 1],
                                                                opacity: [0.8, 1, 0.8],
                                                                filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                                                            }}
                                                            transition={{
                                                                duration: 1.5,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            <Flame className="w-6 h-6 fill-orange-600" />
                                                        </motion.div>
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
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
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
                                    </TabsContent>

                                    <TabsContent value="nutrition" className="mt-0 focus-visible:ring-0">
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: "Energy", value: "125", unit: "kcal", color: "text-amber-600", bg: "bg-amber-50" },
                                                { label: "Protein", value: "9.38", unit: "g", color: "text-blue-600", bg: "bg-blue-50" },
                                                { label: "Carbs", value: "19.79", unit: "g", color: "text-emerald-600", bg: "bg-emerald-50" },
                                                { label: "Fat", value: "1.04", unit: "g", color: "text-rose-600", bg: "bg-rose-50" },
                                                { label: "Sodium", value: "343", unit: "mg", color: "text-slate-600", bg: "bg-slate-100" },
                                                { label: "Cholesterol", value: "31.25", unit: "mg", color: "text-slate-600", bg: "bg-slate-100" },
                                            ].map((item, i) => (
                                                <motion.div
                                                    key={item.label}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{item.label}</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                                                        <span className="text-sm text-slate-500 font-medium">{item.unit}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        <div className="p-4 border-t bg-white">
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
