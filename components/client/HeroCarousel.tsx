'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';

const defaultSlides = [
    {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop',
        title: 'Live Mud Crab',
        title_bn: 'জীবন্ত মাড ক্র্যাব',
        subtitle: 'Fresh from Sundarbans',
        subtitle_bn: 'সুন্দরবন থেকে সরাসরি সংগ্রহকৃত',
        buttonText: 'Order Now',
        buttonLink: '/menu'
    },
    {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
        title: 'Family Platters',
        title_bn: 'ফ্যামিলি প্ল্যাটার',
        subtitle: 'Share the joy',
        subtitle_bn: 'খুশি ভাগ করে নিন',
        buttonText: 'Order Now',
        buttonLink: '/menu'
    },
    {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop',
        title: 'Jumbo Shrimp',
        title_bn: 'জাম্বো চিংড়ি',
        subtitle: 'Grilled to perfection',
        subtitle_bn: 'নিখুঁতভাবে গ্রিল করা',
        buttonText: 'Order Now',
        buttonLink: '/menu'
    },
];

interface HeroSlide {
    id: string;
    imageUrl: string;
    title: string;
    title_bn?: string | null;
    subtitle?: string | null;
    subtitle_bn?: string | null;
    buttonText?: string;
    buttonLink?: string;
}

export function HeroCarousel({ slides = [] }: { slides?: HeroSlide[] }) {
    // Memoize plugins to prevent re-initialization on every render
    const plugins = React.useMemo(() => [Autoplay({ delay: 5000, stopOnInteraction: false })], []);

    // Use default slides if no active slides provided
    const displaySlides = slides.length > 0 ? slides : defaultSlides;

    // Duration 60 makes the scroll transition slower and 'smoother' than the default snap
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 60 }, plugins);
    const { language } = useLanguageStore();
    const t = translations[language];
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const onSelect = React.useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] md:aspect-[21/9]" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
                {displaySlides.map((slide) => (
                    <div className="relative flex-none w-full h-full min-w-0" key={slide.id}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

                        <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="object-cover w-full h-full"
                        />

                        <div className="absolute z-20 left-6 bottom-8 max-w-[80%] text-white">
                            <span className={`inline-block px-3 py-1 rounded-sm bg-crab-red text-white text-[10px] uppercase tracking-widest font-bold mb-3 shadow-sm ${language !== 'en' ? 'font-bangla' : 'font-body'}`}>
                                {language === 'en' ? (slide.subtitle || '') : (slide.subtitle_bn || slide.subtitle || '')}
                            </span>
                            <h2 className={`text-4xl font-heading font-bold leading-tight drop-shadow-lg mb-2 ${language !== 'en' ? 'font-bangla' : 'font-heading'}`}>
                                {language === 'en' ? slide.title : (slide.title_bn || slide.title)}
                            </h2>
                            <Link href={slide.buttonLink || '/menu'}>
                                <button className="text-xs font-bold uppercase tracking-widest border-b-2 border-white/80 pb-0.5 hover:text-sand hover:border-sand transition-colors">
                                    {/* Use slide specific button text if available, else standard translation */}
                                    {(language === 'en' && slide.buttonText) ? slide.buttonText : t.orderNow}
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Glass-like Indicator */}
            <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 shadow-lg">
                {displaySlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`transition-all duration-300 rounded-full ${index === selectedIndex ? 'w-4 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
                        // @ts-ignore
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
