'use client';

import { motion } from 'framer-motion';

export default function HeroStory() {
    return (
        <section className="min-h-[80vh] flex flex-col items-center justify-center relative z-10 p-6 text-center">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-crab-red/10 text-crab-red px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-6 border border-crab-red/20 backdrop-blur-sm"
            >
                Since 2023
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-8xl font-black text-ocean-blue mb-6 font-heading leading-tight"
            >
                The Story of <br />
                <span className="text-crab-red">Authentic Flow.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-2xl text-lg md:text-xl text-gray-500 font-medium leading-relaxed"
            >
                From the depths of the ocean to the heart of Dhaka. We started with a simple belief:
                freshness isn't just a promise, it's our only rule.
            </motion.p>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sand to-sand/50 -z-10 pointer-events-none" />
        </section>
    );
}
