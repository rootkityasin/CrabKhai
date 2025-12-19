'use client';

import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const slides = [
    { id: 1, src: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop', alt: 'Spicy Crab Curry', title: 'Live Mud Crab', subtitle: 'Fresh from Sundarbans' },
    { id: 2, src: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop', alt: 'Platters', title: 'Family Platters', subtitle: 'Share the joy' },
    { id: 3, src: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop', alt: 'Shrimp', title: 'Jumbo Shrimp', subtitle: 'Grilled to perfection' },
];

export function HeroCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

    return (
        <div className="relative overflow-hidden bg-gray-100 aspect-[5/3] md:aspect-[21/9]" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
                {slides.map((slide) => (
                    <div className="relative flex-none w-full h-full min-w-0" key={slide.id}>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                        <img
                            src={slide.src}
                            alt={slide.alt}
                            className="object-cover w-full h-full"
                        />

                        <div className="absolute z-20 left-5 bottom-6 max-w-[80%]">
                            <span className="inline-block px-2 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider mb-2">{slide.subtitle}</span>
                            <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">{slide.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
