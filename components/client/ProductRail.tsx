'use client';

import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: string | number;
    image: string;
}

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface ProductRailProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
    enableScrollAnimation?: boolean;
}

export function ProductRail({ title, products, viewAllLink = '#', enableScrollAnimation = false }: ProductRailProps) {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 90%", "end 10%"]
    });

    // Gentle floating effect: starts with offset (40px) and moves left (-120px) for speed
    const rawX = useTransform(scrollYProgress, [0, 1], [40, -120]);
    const x = useSpring(rawX, { stiffness: 150, damping: 20, mass: 0.5 });

    return (
        <section ref={containerRef} className="py-4 border-t border-gray-50">
            <div className="flex items-center justify-between px-4 mb-3">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <Link href={viewAllLink} className="flex items-center text-xs font-semibold text-primary">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </div>

            <div className={`overflow-x-auto pb-4 hide-scrollbar ${enableScrollAnimation ? '' : 'snap-x'}`}>
                <motion.div
                    className="flex gap-4 px-4 w-max"
                    style={{
                        x: enableScrollAnimation ? x : 0,
                        willChange: enableScrollAnimation ? 'transform' : 'auto'
                    }}
                >
                    {products.map((product) => (
                        <div key={product.id} className={`w-[160px] flex-none ${enableScrollAnimation ? '' : 'snap-start'}`}>
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                price={String(product.price)}
                                image={product.image}
                                name_bn={(product as any).name_bn}
                                price_bn={(product as any).price_bn}
                                nutritionImage={(product as any).nutritionImage}
                                cookingImage={(product as any).cookingImage}
                                nutrition={(product as any).nutrition}
                                cookingInstructions={(product as any).cookingInstructions}
                                pieces={(product as any).pieces}
                                totalSold={(product as any).totalSold}
                                weightOptions={(product as any).weightOptions}
                                images={(product as any).images}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
