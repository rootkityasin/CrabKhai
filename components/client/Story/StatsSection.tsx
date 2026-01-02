'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface StatCardProps {
    value: number;
    label: string;
    suffix?: string;
    delay?: number;
}

function useCounter(end: number, duration: number = 2, shouldStart: boolean = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, shouldStart]);

    return count;
}

function StatCard({ value, label, suffix = '', delay = 0 }: StatCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const count = useCounter(value, 2, isInView);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 hover:border-crab-red/50 transition-colors"
        >
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-crab-red mb-2">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-slate-300 text-base md:text-lg">{label}</div>
        </motion.div>
    );
}

export function StatsSection() {
    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        By The Numbers
                    </h2>
                    <p className="text-slate-400 text-lg">Our journey in numbers</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard value={5000} suffix="+" label="Products Sold" delay={0.1} />
                    <StatCard value={1200} suffix="+" label="Happy Customers" delay={0.2} />
                    <StatCard value={3} label="Cities Served" delay={0.3} />
                    <StatCard value={500} suffix="+" label="5-Star Reviews" delay={0.4} />
                </div>
            </div>
        </section>
    );
}
