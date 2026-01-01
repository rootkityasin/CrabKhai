'use client';

import { motion } from 'framer-motion';

// Using placeholders if specific food images aren't handy, but ideally these should be product images
const images = [
    "/mascot-avatar.png", // reusing for demo
    "/logo.png",
    "/mascot-avatar.png",
    "/logo.png",
    "/mascot-avatar.png",
    "/logo.png", // Repeat to ensure seamless loop
];

export default function GallerySection() {
    return (
        <section className="py-24 relative z-10 overflow-hidden bg-ocean-blue/5">
            <div className="absolute inset-0 bg-gradient-to-r from-sand via-transparent to-sand z-20 pointer-events-none" />

            <div className="mb-12 text-center relative z-20">
                <h2 className="text-3xl md:text-5xl font-black text-ocean-blue font-heading">
                    Visual <span className="text-crab-red">Feast</span>
                </h2>
                <p className="text-gray-500 mt-2">A glimpse into our kitchen</p>
            </div>

            <div className="flex relative items-center">
                {/* Marquee Container */}
                <motion.div
                    className="flex gap-8 whitespace-nowrap min-w-full"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: "linear",
                    }}
                >
                    {[...images, ...images].map((src, i) => (
                        <div
                            key={i}
                            className="w-64 h-80 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl bg-white relative border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-300"
                        >
                            <img
                                src={src}
                                alt="Gallery Item"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
