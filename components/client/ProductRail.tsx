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

interface ProductRailProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
}

export function ProductRail({ title, products, viewAllLink = '#' }: ProductRailProps) {
    return (
        <section className="py-4 border-t border-gray-50">
            <div className="flex items-center justify-between px-4 mb-3">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <Link href={viewAllLink} className="flex items-center text-xs font-semibold text-primary">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-4">
                {products.map((product) => (
                    <div key={product.id} className="w-[160px] flex-none snap-start">
                        <ProductCard
                            id={product.id}
                            name={product.name}
                            price={String(product.price)}
                            image={product.image}
                            name_bn={(product as any).name_bn}
                            price_bn={(product as any).price_bn}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
