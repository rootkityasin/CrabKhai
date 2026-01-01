'use client';

import ScrollyCrab from '@/components/client/Story/ScrollyCrab';
import HeroStory from '@/components/client/Story/HeroStory';
import StatsSection from '@/components/client/Story/StatsSection';
import GallerySection from '@/components/client/Story/GallerySection';
import TeamSection from '@/components/client/Story/TeamSection';

export default function StoryPage() {
    return (
        <main className="bg-sand min-h-screen relative overflow-hidden">
            {/* The Scrollytelling Background Element */}
            <ScrollyCrab />

            {/* Content Sections - Zig-Zag Layout for "Flight Path" */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6">

                {/* 1. Hero: Text on LEFT, Crab flies Right */}
                <section className="min-h-screen flex items-center justify-start">
                    <div className="max-w-xl">
                        <HeroStory />
                    </div>
                </section>

                {/* 2. Stats: Content on RIGHT, Crab flies Left */}
                <section className="min-h-screen flex items-center justify-end">
                    <div className="max-w-xl w-full">
                        <StatsSection />
                    </div>
                </section>

                {/* 3. Gallery: Content on LEFT, Crab flies Right */}
                <section className="min-h-screen flex items-center justify-start">
                    <div className="max-w-2xl w-full">
                        <GallerySection />
                    </div>
                </section>

                {/* 4. Team: Content on RIGHT, Crab flies Left */}
                <section className="min-h-screen flex items-center justify-end">
                    <div className="max-w-xl w-full">
                        <TeamSection />
                    </div>
                </section>
            </div>

            {/* Footer Note */}
            <div className="text-center py-12 relative z-10 opacity-50 font-bold uppercase tracking-widest text-xs">
                Est. 2023 • Dhaka, Bangladesh
            </div>
        </main>
    );
}
