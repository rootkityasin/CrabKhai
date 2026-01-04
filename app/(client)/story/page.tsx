import { HeroStory } from '@/components/client/Story/HeroStory';
import { ValuesSection } from '@/components/client/Story/ValuesSection';
import { GallerySection } from '@/components/client/Story/GallerySection';
import { WholesaleCTA } from '@/components/client/Story/WholesaleCTA';
import { ReviewSection } from '@/components/client/Story/ReviewSection';
import { TeamSection } from '@/components/client/Story/TeamSection';
import { StickyFooterWrapper } from '@/components/client/Story/StickyFooterWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story | CrabKhai',
    description: 'Discover the journey of CrabKhai - from humble beginnings to becoming Bangladesh\'s premier crab delivery service. Experience our story through stunning animations and interactive scrollytelling.',
};

import { getStorySections, getProductsByIds } from '@/app/actions/story';
import { StoryProducts } from '@/components/client/Story/StoryProducts';

export default async function StoryPage() {
    const sections = await getStorySections();

    // Helper to find content by type
    const getContent = (type: string) => sections.find((s: any) => s.type === type)?.content as any || null;

    const productsContent = getContent('PRODUCTS');
    const products = productsContent?.productIds ? await getProductsByIds(productsContent.productIds) : [];

    return (
        <main className="relative bg-slate-950 min-h-screen overflow-x-hidden">
            <HeroStory data={getContent('HERO')} />

            <StickyFooterWrapper footer={null}>
                <div className="relative bg-slate-950 z-10 shadow-2xl pb-20">
                    <ValuesSection data={getContent('VALUES')} />
                    <StoryProducts data={productsContent} products={products} />
                    <GallerySection data={getContent('GALLERY')} />
                    <TeamSection data={getContent('TEAM')} />
                    <WholesaleCTA data={getContent('WHOLESALE')} />
                    <ReviewSection data={getContent('REVIEWS')} />
                </div>
            </StickyFooterWrapper>
        </main>
    );
}
