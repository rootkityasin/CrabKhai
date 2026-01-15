'use client';

import { useState, useEffect } from 'react';
import { HeroCarousel } from '@/components/client/HeroCarousel';
import { CategoryNav } from '@/components/client/CategoryNav';
import { ProductRail } from '@/components/client/ProductRail';
import TrustFooter from '@/components/client/TrustFooter';
import { getProducts } from '@/app/actions/product';
import { getSiteConfig } from '@/app/actions/settings';
import { getHeroSlides } from '@/app/actions/hero';
import { getHomeSections } from '@/app/actions/section';

export default function ClientHomePage() {
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [config, setConfig] = useState<any>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [hData, cData, sData] = await Promise.all([
                    getHeroSlides(),
                    getSiteConfig(),
                    getHomeSections()
                ]);
                setHeroSlides(hData);
                setConfig(cData);
                setSections(sData);
            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>;
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <HeroCarousel slides={heroSlides} />

            {/* Categories */}
            <CategoryNav />

            {/* Dynamic Sections */}
            <div className="space-y-4">
                {sections.map((section, index) => (
                    section.products.length > 0 && (
                        <div key={section.id} id={`section-${section.slug}`} className="scroll-mt-32">
                            <ProductRail
                                title={section.title}
                                products={section.products}
                                enableScrollAnimation={index === 0}
                            />
                        </div>
                    )
                ))}

                {sections.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                        No active sections found.
                    </div>
                )}
            </div>

            {/* Trust Footer */}
            <TrustFooter config={config} />
        </main>
    );
}
