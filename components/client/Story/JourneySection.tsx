'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const milestones = [
    { year: '2023', title: 'The Beginning', description: 'Founded with a vision to deliver premium quality crabs' },
    { year: '2023', title: 'First Delivery', description: 'Served our first 100 happy customers in Dhaka' },
    { year: '2024', title: 'Expansion', description: 'Opened kitchens in 3 major cities' },
    { year: '2024', title: 'Innovation', description: 'Introduced ready-to-eat crab products' },
    { year: '2025', title: 'Recognition', description: 'Awarded Best Seafood Delivery Service' },
];

export function JourneySection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Crab walks from top to bottom as user scrolls
    const crabY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    const crabRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        The Journey
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">Scroll to walk through our story</p>
                </motion.div>

                {/* Timeline Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-crab-red/50 to-transparent" />

                {/* Walking Crab */}
                <motion.div
                    style={{ y: crabY }}
                    className="absolute left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 pointer-events-none z-20"
                >
                    <motion.img
                        src="/mascot/story-character.png"
                        alt="Walking Crab"
                        style={{ rotate: crabRotate }}
                        className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                </motion.div>

                {/* Milestones */}
                <div className="relative space-y-16">
                    {milestones.map((milestone, index) => {
                        const isLeft = index % 2 === 0;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6 hover:border-crab-red/50 transition-colors">
                                        <div className="text-crab-red font-bold text-xl mb-2">{milestone.year}</div>
                                        <h3 className="text-white font-semibold text-xl md:text-2xl mb-2">{milestone.title}</h3>
                                        <p className="text-slate-400 text-sm md:text-base">{milestone.description}</p>
                                    </div>
                                </div>

                                {/* Timeline Dot */}
                                <div className="w-6 h-6 rounded-full bg-crab-red border-4 border-slate-900 z-10 flex-shrink-0" />

                                <div className="flex-1" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
