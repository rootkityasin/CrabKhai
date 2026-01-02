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

export default function StoryPage() {
    return (
        <main className="relative bg-slate-950 min-h-screen overflow-x-hidden">
            <HeroStory />

            <StickyFooterWrapper footer={null /* Footer is handled by layout, but needed for sticky effect logic if local */}>
                <div className="relative bg-slate-950 z-10 shadow-2xl pb-20">
                    {/* Shadow helps separate content from footer during reveal */}
                    <ValuesSection />
                    <GallerySection />
                    <TeamSection />
                    <WholesaleCTA />
                    <ReviewSection />
                </div>
            </StickyFooterWrapper>
        </main>
    );
}
