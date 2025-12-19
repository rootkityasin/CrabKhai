'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-ocean-blue text-white py-12 pb-24">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-heading text-2xl font-bold mb-4">CrabKhai</h3>
                        <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                            Bringing the freshest flavors of the Sundarbans directly to your doorstep. Premium quality, guaranteed.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-sand">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-white/80">
                            <li><Link href="/" className="hover:text-sand transition-colors">Our Story</Link></li>
                            <li><Link href="/menu" className="hover:text-sand transition-colors">Menu</Link></li>
                            <li><Link href="/" className="hover:text-sand transition-colors">Contact</Link></li>
                            <li><Link href="/" className="hover:text-sand transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-sand">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-crab-red transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-crab-red transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-crab-red transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-xs text-white/50">
                    <p>&copy; {new Date().getFullYear()} CrabKhai. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
