'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WholesaleProps {
    data: {
        title: string;
        description: string;
        whatsappNumber: string;
        image: string;
    } | null;
}

export function WholesaleCTA({ data }: WholesaleProps) {
    // Verified WhatsApp number from user
    const whatsappNumber = data?.whatsappNumber || '8801804221161';
    const message = encodeURIComponent("Hi, I'm interested in wholesale/business partnership with CrabKhai.");
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    const title = data?.title || "Want to buy in Wholesale?";
    const description = data?.description || "We supply premium quality crabs to restaurants, hotels, and event caterers across Bangladesh. Partner with us for consistent quality and special bulk pricing.";
    const image = data?.image || "/mascot/story-character.png";

    return (
        <section className="relative py-24 px-6 bg-slate-900 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-50" />

            <div className="relative max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-crab-red/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />

                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-crab-red font-bold tracking-wider uppercase mb-2 block">Business Partnership</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                {title}
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                {description}
                            </p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-500 text-white border-0 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-green-500/25 transition-all duration-300 group"
                                    onClick={() => window.open(whatsappLink, '_blank')}
                                >
                                    <MessageCircle className="mr-2 h-6 w-6" />
                                    Chat on WhatsApp
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden md:block"
                        >
                            <img
                                src={image} // Valid existing mascot path
                                alt="Wholesale Delivery"
                                className="w-full max-w-md mx-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
