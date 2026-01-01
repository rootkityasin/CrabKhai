'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { label: "Crabs Sold", value: "5000+", color: "text-crab-red" },
    { label: "Happy Customers", value: "1200+", color: "text-blue-600" },
    { label: "Delivery Partners", value: "50+", color: "text-green-600" },
    { label: "Years Active", value: "2", color: "text-purple-600" },
];

export default function StatsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-20 relative z-10 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200
                        }}
                        className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 text-center hover:scale-105 transition-transform"
                    >
                        <h3 className={`text-4xl md:text-5xl font-black mb-2 font-heading ${stat.color}`}>
                            {stat.value}
                        </h3>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest font-body">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
