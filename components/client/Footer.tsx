'use client';

import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';

import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';

interface FooterProps {
    config?: {
        contactPhone: string;
        contactEmail: string;
        contactAddress: string;
        shopName?: string;
        logoUrl?: string;
    } | null;
}

export function Footer({ config }: FooterProps) {
    const { language } = useLanguageStore();
    const t = translations[language];

    const phone = config?.contactPhone || "+880 1804 221 161";
    const email = config?.contactEmail || "crabkhaibangladesh@gmail.com";
    const shopName = config?.shopName || "CrabKhai";

    // Clean phone for tel link (remove spaces/dashes)
    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    return (
        <footer className="bg-crab-red text-white py-12 pb-24">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-heading text-2xl font-bold mb-4">{shopName}</h3>
                        <p className={`text-white/70 text-sm leading-relaxed max-w-xs ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>
                            {language === 'en' ? 'Bringing the freshest flavors of the Sundarbans directly to your doorstep. Premium quality, guaranteed.' : 'সুন্দরবনের তাজা স্বাদ সরাসরি আপনার দরজায়। প্রিমিয়াম টি, গ্যারান্টিযুক্ত।'}
                        </p>
                    </div>

                    <div>
                        <h4 className={`font-bold uppercase tracking-widest text-xs mb-4 text-sand ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.quickLinks}</h4>
                        <ul className={`space-y-2 text-sm text-white/80 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>
                            <li><Link href="/story" className="hover:text-sand transition-colors">{t.ourStory}</Link></li>
                            <li><Link href="/menu" className="hover:text-sand transition-colors">{t.menu}</Link></li>
                            <li><a href={`mailto:${email}`} className="hover:text-sand transition-colors">{t.contact}</a></li>
                            <li><Link href="/" className="hover:text-sand transition-colors">{t.terms}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-bold uppercase tracking-widest text-xs mb-4 text-sand ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.connect}</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="https://www.facebook.com/profile.php?id=100091247111475" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-crab-red transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/crabkhai" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-crab-red transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={`https://wa.me/${cleanPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-green-500 transition-colors">
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="text-white/70 text-sm space-y-2">
                            <a href={`tel:${cleanPhone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                <Phone className="w-4 h-4" /> {phone}
                            </a>
                            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" /> {email}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-xs text-white/50">
                    <p>&copy; {new Date().getFullYear()} {shopName}. {t.rightsReserved}</p>
                </div>
            </div>
        </footer>
    );
}
