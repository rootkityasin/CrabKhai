'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';

interface TrustFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    config?: {
        contactPhone: string;
        contactEmail: string;
        contactAddress: string;
        allergensText: string;
        certificates: string[];
    } | null;
}

import { getSiteConfig } from '@/app/actions/settings';
import { useEffect, useState } from 'react';

export default function TrustFooter({ config: initialConfig, ...props }: TrustFooterProps) {
    const [config, setConfig] = useState<any>(initialConfig || null);

    useEffect(() => {
        getSiteConfig().then((data) => {
            if (data) setConfig(data);
        });
    }, []);
    // Default Fallbacks
    const phone = config?.contactPhone || "+880 1804 221 161";
    const email = config?.contactEmail || "crabkhaibangladesh@gmail.com";
    const address = config?.contactAddress || "195 Green Road, Dhaka";
    const allergenText = config?.allergensText || "Crustaceans";
    const shopName = config?.shopName || "CrabKhai";
    const logoUrl = config?.logoUrl || "/logo.svg";
    // Forcing local images to ensure they display correctly (bypassing potentially broken DB URLs)
    const certificates = [
        {
            src: "/certifications/cert-1.png",
            url: "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/hazard-analysis-critical-control-point-haccp",
            alt: "HACCP Certified - Hazard Analysis Critical Control Point"
        },
        {
            src: "/certifications/cert-2.png",
            url: "https://www.ispe.org/initiatives/regulatory-resources/gmp",
            alt: "GMP Certified - Good Manufacturing Practice"
        },
        {
            src: "/certifications/cert-3.png",
            url: "https://www.brcgs.com/our-standards/food-safety/",
            alt: "BRGS Certified - Food Safety Standard"
        }
    ];
    return (
        <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-12 px-4 overflow-hidden relative">
            {/* Artistic Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-br-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-tl-full blur-2xl" />

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-3"
                >
                    <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium tracking-wider mb-1">
                        OFFICIAL CONTACT
                    </div>

                    <div className="space-y-2">
                        <a
                            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                            className="flex items-start gap-4 group p-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 cursor-pointer"
                        >
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors shadow-sm shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>
                            <span className="font-mono text-base tracking-wide group-hover:text-amber-200 transition-colors break-all pt-1.5">{phone}</span>
                        </a>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 group p-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 cursor-pointer"
                        >
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors shadow-sm shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm group-hover:text-amber-200 transition-colors pt-1.5">{address}</span>
                        </a>

                        <a
                            href={`mailto:${email}`}
                            className="flex items-start gap-4 group p-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 cursor-pointer"
                        >
                            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors shadow-sm shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <span className="text-sm opacity-90 group-hover:text-amber-200 transition-colors break-all pt-1.5">{email}</span>
                        </a>
                    </div>

                    {/* Allergens Warning */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-start gap-3 text-red-100 bg-red-900/30 p-3 rounded-xl backdrop-blur-sm border border-red-500/30">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-300 animate-pulse" />
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wider text-amber-200 mb-1">Consumer Advisory</h4>
                                <p className="text-xs leading-relaxed opacity-90">
                                    <strong className="text-amber-400">Allergen Advice:</strong> Contains <a href={`https://www.google.com/search?q=${encodeURIComponent(allergenText)}`} target="_blank" rel="noopener noreferrer" className="text-white font-bold border-b border-amber-400/50 hover:text-amber-300 hover:border-amber-300 transition-colors cursor-pointer" title="Search for this allergen">{allergenText}</a>.
                                    Please inform us about any food allergies before ordering.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Certification Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-6 h-6 text-green-300" />
                        <h3 className="text-lg font-bold font-serif tracking-wide">Quality Guaranteed</h3>
                    </div>

                    <p className="text-xs text-white/70 mb-4 max-w-xs">
                        Our products are processed in facilities adhering to the highest international safety standards.
                    </p>

                    <div className="mt-4 text-[10px] font-mono text-white/40 tracking-widest uppercase mb-2">
                        Verified & Certified By
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {certificates.map((cert, index) => (
                            <motion.a
                                key={index}
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                className="w-16 h-16 bg-white rounded-full p-2 shadow-lg flex items-center justify-center transform hover:z-10 transition-all duration-300 border-2 border-white/50 cursor-pointer hover:border-amber-400"
                                title={`Click to read about ${cert.alt}`}
                            >
                                <img src={cert.src} alt={cert.alt} className="w-full h-full object-contain" />
                            </motion.a>
                        ))}
                    </div>

                    <div className="mt-8 text-xs font-mono text-white/40 tracking-widest uppercase">
                        Verified & Certified for {shopName}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
