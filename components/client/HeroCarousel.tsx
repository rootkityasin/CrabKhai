'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

const slides = [
    { id: 1, src: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop', alt: 'Spicy Crab Curry', title: 'Live Mud Crab', subtitle: 'Fresh from Sundarbans' },
    { id: 2, src: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop', alt: 'Platters', title: 'Family Platters', subtitle: 'Share the joy' },
    { id: 3, src: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop', alt: 'Shrimp', title: 'Jumbo Shrimp', subtitle: 'Grilled to perfection' },
];

export function HeroCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    return (
        <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] md:aspect-[21/9]" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
                {slides.map((slide) => (
                    <div className="relative flex-none w-full h-full min-w-0" key={slide.id}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

                        <img
                            src={slide.src}
                            alt={slide.alt}
                            className="object-cover w-full h-full"
                        />

                        <div className="absolute z-20 left-6 bottom-8 max-w-[80%] text-white">
                            <span className="inline-block px-3 py-1 rounded-sm bg-crab-red text-white text-[10px] uppercase tracking-widest font-bold mb-3 shadow-sm">
                                {slide.subtitle}
                            </span>
                            <h2 className="text-4xl font-heading font-bold leading-tight drop-shadow-lg mb-2">
                                {slide.title}
                            </h2>
                            <Link href="/menu">
                                <button className="text-xs font-bold uppercase tracking-widest border-b-2 border-white/80 pb-0.5 hover:text-sand hover:border-sand transition-colors">
                                    Shop Now
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
