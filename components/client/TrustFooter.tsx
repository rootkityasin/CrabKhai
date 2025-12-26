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

export default function TrustFooter({ config, ...props }: TrustFooterProps) {
    // Default Fallbacks
    const phone = config?.contactPhone || "+880 1804 221 161";
    const email = config?.contactEmail || "crabkhaibangladesh@gmail.com";
    const address = config?.contactAddress || "195 Green Road, Dhaka";
    const allergenText = config?.allergensText || "Crustaceans";
    const certificates = config?.certificates && config.certificates.length > 0
        ? config.certificates
        : [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/HACCP_Certification_Mark.svg/1200px-HACCP_Certification_Mark.svg.png",
            "https://www.qualityaustria.com/fileadmin/_processed_/c/9/csm_GMP_Good_Manufacturing_Practice_Logo_3502845680.jpg"
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
                    className="space-y-6"
                >
                    <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium tracking-wider mb-2">
                        OFFICIAL CONTACT
                    </div>

                    <div className="space-y-4">
                        <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-4 group hover:opacity-80 transition-opacity">
                            <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <span className="font-mono text-lg tracking-wide">{phone}</span>
                        </a>

                        <div className="flex items-center gap-4 group">
                            <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{address}</span>
                        </div>

                        <a href={`mailto:${email}`} className="flex items-center gap-4 group hover:opacity-80 transition-opacity">
                            <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-sm opacity-90">{email}</span>
                        </a>
                    </div>

                    {/* Allergens Warning */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                        <div className="flex items-start gap-3 text-red-100 bg-red-900/30 p-4 rounded-xl backdrop-blur-sm border border-red-500/30">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-300 animate-pulse" />
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wider text-amber-200 mb-1">Consumer Advisory</h4>
                                <p className="text-xs leading-relaxed opacity-90">
                                    Contains Allergens: <strong className="text-white decoration-amber-400 underline decoration-wavy underline-offset-2">{allergenText}</strong>.
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
                    className="flex flex-col items-center text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck className="w-6 h-6 text-green-300" />
                        <h3 className="text-xl font-bold font-serif tracking-wide">Quality Guaranteed</h3>
                    </div>

                    <p className="text-sm text-white/70 mb-8 max-w-xs">
                        Our products are processed in facilities adhering to the highest international safety standards.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full p-2 shadow-lg flex items-center justify-center"
                            >
                                <img src={cert} alt="Certification" className="w-full h-full object-contain" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 text-xs font-mono text-white/40 tracking-widest uppercase">
                        Verified & Certified
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
