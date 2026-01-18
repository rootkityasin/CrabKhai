'use client';

import { motion } from 'framer-motion';

export function ScrollMouse() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="flex flex-col items-center gap-6 group cursor-pointer"
        >
            <div className="relative flex items-center justify-center">
                {/* Immersive Pulsing Background Layers */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-12 h-12 bg-crab-red/20 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.2, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute w-8 h-8 bg-crab-red/10 rounded-full blur-md"
                />

                {/* The Mouse Device Body */}
                <div className="relative w-[30px] h-[50px] rounded-[15px] border-[2px] border-crab-red/30 flex items-start justify-center p-2 bg-white/5 backdrop-blur-[2px] overflow-hidden group-hover:border-crab-red/60 transition-colors duration-500">
                    {/* Interior Subtle Shine */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    {/* Scrolling 'Wheel' Indicator with Spring Physics */}
                    <motion.div
                        animate={{
                            y: [0, 20],
                            opacity: [0, 1, 0],
                            scaleY: [0.5, 1, 0.5],
                            scaleX: [1, 0.8, 1]
                        }}
                        transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: [0.45, 0.05, 0.55, 0.95], // Premium Bezier
                            times: [0, 0.5, 1]
                        }}
                        className="w-[3px] h-3 bg-crab-red rounded-full relative shadow-[0_0_10px_rgba(230,0,0,0.5)]"
                    >
                        {/* Dot Trail effect */}
                        <div className="absolute -top-1 left-0 w-full h-[200%] bg-gradient-to-t from-crab-red/40 to-transparent blur-[1px]" />
                    </motion.div>
                </div>

                {/* Floating Ring around the Mouse */}
                <motion.div
                    animate={{
                        rotate: 360,
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -inset-2 border-[1px] border-dashed border-crab-red/10 rounded-[20px] pointer-events-none"
                />
            </div>

            {/* Typography & Animated Line */}
            <div className="flex flex-col items-center gap-2">
                <motion.span
                    animate={{
                        letterSpacing: ["0.3em", "0.45em", "0.3em"],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2"
                >
                    <span className="w-1 h-1 bg-crab-red rounded-full" />
                    Scroll
                    <span className="w-1 h-1 bg-crab-red rounded-full" />
                </motion.span>

                {/* Animated Flow Line */}
                <div className="relative w-px h-16 bg-gray-100 overflow-hidden">
                    <motion.div
                        animate={{
                            y: ["-100%", "100%"]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-crab-red to-transparent"
                    />
                </div>
            </div>
        </motion.div>
    );
}
