'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAnimationStore } from '@/lib/animationStore';
import { useCartStore } from '@/lib/store';
import { useLanguageStore } from '@/lib/languageStore';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
    id: string;
    name: string;
    name_bn?: string;
    price: string;
    price_bn?: string;
    image: string;
    categoryId?: string;
    nutritionImage?: string;
    cookingImage?: string;
}

export function ProductCard({ id, name, name_bn, price, price_bn, image, nutritionImage, cookingImage }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { language } = useLanguageStore();
    const { triggerFly } = useAnimationStore();
    const imageRef = useRef<HTMLImageElement>(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const displayPrice = language !== 'en' && price_bn ? price_bn : price;
    const displayName = language !== 'en' && name_bn ? name_bn : name;

    const handleAddToCart = () => {
        // Trigger Fly Animation
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            triggerFly(image, {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
        }

        // Add to Store
        addItem({ id, name, price: Number(price.replace(/[^0-9.]/g, '')), image, quantity: 1 });

        toast.custom((t) => (
            <div className="flex items-center gap-4 w-full bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{name}</h4>
                    <p className="text-gray-500 text-xs">Added to cart</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Plus className="w-4 h-4" />
                </div>
            </div>
        ), { duration: 2000, position: 'top-center' });
    };

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.div
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
                onClick={() => setShowModal(true)}
                style={{
                    rotateX,
                    rotateY,
                    perspective: 1000,
                    transformStyle: "preserve-3d"
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                    {/* Glossy Overlay for 3D effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />

                    <img
                        ref={imageRef}
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 will-change-transform"
                        loading="lazy"
                    />
                </div>
                <div className="p-3 bg-white relative z-20">
                    <h3 className={`font-bold text-gray-800 line-clamp-1 mb-1 ${language !== 'en' ? 'font-bangla text-base' : 'font-heading text-sm'}`}>
                        {displayName}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className={`text-crab-red font-bold ${language !== 'en' ? 'font-bangla' : 'font-body'}`}>
                            ৳{displayPrice}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-crab-red transition-colors active:scale-95 z-30 shadow-lg"
                            aria-label="Add to cart"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            <ProductModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                product={{ id, name, price, image, nutritionImage, cookingImage }}
            />
        </>
    );
}
