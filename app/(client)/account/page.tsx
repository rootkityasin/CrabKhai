'use client';

import { useState, useEffect } from 'react';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight, HelpCircle, Camera, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/lib/languageStore';
import { translations } from '@/lib/translations';

export default function AccountPage() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { language } = useLanguageStore();
    const t = translations[language];

    // State for form data including image
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        area: '',
        address: '',
        image: '',
        points: 0,
        status: 'Bronze'
    });

    useEffect(() => {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('crabkhai_user');
        if (storedUser) {
            setIsLoggedIn(true);
            const parsedData = JSON.parse(storedUser);
            // Merge with defaults to ensure points/status exist for legacy data
            setFormData(prev => ({
                ...prev,
                ...parsedData,
                points: parsedData.points ?? 0,
                status: parsedData.status ?? 'Bronze'
            }));
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock login logic - store in localstorage
        localStorage.setItem('crabkhai_user', JSON.stringify(formData));
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('crabkhai_user');
        setIsLoggedIn(false);
        setFormData({ name: '', phone: '', email: '', area: '', address: '', image: '', points: 0, status: 'Bronze' });
        router.push('/');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => {
                    const updated = { ...prev, image: base64String };
                    // Auto-save if logged in
                    if (isLoggedIn) {
                        localStorage.setItem('crabkhai_user', JSON.stringify(updated));
                    }
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Mock User Data
    const user = {
        name: isLoggedIn ? formData.name || 'Foodie' : 'Guest',
        phone: isLoggedIn ? formData.phone : '',
        email: isLoggedIn ? formData.email : '',
        address: isLoggedIn ? formData.address : '',
        image: isLoggedIn ? formData.image : '',
        memberSince: 'December 2025',
        points: 0
    };

    if (!isLoggedIn) {
        return (
            <div className="pt-24 px-4 pb-12">
                <div className="text-center mb-8">
                    {/* Profile Picture Upload - Moved above title */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-xl shadow-gray-200 group-hover:scale-105 transition-transform duration-300">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-crab-red text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition-colors hover:scale-110 active:scale-95">
                                <Camera className="w-5 h-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    <h2 className={`text-3xl font-black text-gray-900 mb-2 ${language === 'bn' ? 'font-bangla' : 'font-heading'}`}>{t.profile.loginTitle}</h2>
                    <p className={`text-gray-500 font-medium ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>Enter your details to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.nameLabel}</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-4 bg-white rounded-2xl border-0 shadow-sm ring-1 ring-gray-100 focus:outline-none focus:ring-2 focus:ring-crab-red/20 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            placeholder={language === 'en' ? "e.g. Rakib Hassan" : "যেমন: রাকিব হাসান"}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.phoneLabel}</label>
                        <input
                            type="tel"
                            required
                            className="w-full px-5 py-4 bg-white rounded-2xl border-0 shadow-sm ring-1 ring-gray-100 focus:outline-none focus:ring-2 focus:ring-crab-red/20 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            placeholder="+880..."
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.emailLabel}</label>
                        <input
                            type="email"
                            className="w-full px-5 py-4 bg-white rounded-2xl border-0 shadow-sm ring-1 ring-gray-100 focus:outline-none focus:ring-2 focus:ring-crab-red/20 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.areaLabel}</label>
                        <div className="relative">
                            <select
                                className="w-full px-5 py-4 bg-white rounded-2xl border-0 shadow-sm ring-1 ring-gray-100 focus:outline-none focus:ring-2 focus:ring-crab-red/20 transition-all font-medium text-gray-900 appearance-none"
                                value={formData.area || ''}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            >
                                <option value="">{t.profile.selectArea}</option>
                                {['Dhaka', 'Khulna', 'Chattogram'].map((area) => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.addressLabel}</label>
                        <textarea
                            className="w-full px-5 py-4 bg-white rounded-2xl border-0 shadow-sm ring-1 ring-gray-100 focus:outline-none focus:ring-2 focus:ring-crab-red/20 transition-all resize-none font-medium text-gray-900 placeholder:text-gray-400"
                            placeholder={language === 'en' ? "House, Road, Area..." : "বাড়ি, রাস্তা, এলাকা..."}
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 mt-4 bg-crab-red text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 text-lg ${language === 'bn' ? 'font-bangla' : 'font-body'}`}
                    >
                        {t.profile.saveProfile}
                    </button>
                </form>
            </div>
        );
    }

    // --- PROFILE VIEW ---
    return (
        <div className="bg-gray-50">
            {/* Header Profile Card - Modernized Ocean Blue */}
            <div className="bg-crab-red text-white p-6 pt-20 pb-12 rounded-b-[2.5rem] shadow-xl mb-6 relative overflow-hidden animate-slide-down">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative group mb-4">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/20 overflow-hidden shadow-2xl ring-4 ring-white/10 hover:scale-105 transition-transform duration-300">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-white/90" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-white text-crab-red p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all duration-200">
                            <Camera className="w-4 h-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>

                    <h1 className={`text-2xl font-bold tracking-tight mb-1 ${language === 'bn' ? 'font-bangla' : 'font-heading'}`}>{user.name}</h1>
                    <p className={`text-white/60 font-medium text-sm ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{user.phone}</p>

                    <div className="flex items-center gap-2 mt-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className={`text-xs font-bold tracking-wide ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.memberSince} <span className="text-white/80 font-normal">Dec 2025</span></span>
                    </div>
                </div>
            </div>

            {/* Menu List - Modern Grouped Style */}
            <div className="px-5 -mt-10 relative z-20 space-y-3">

                {/* Stats Cards */}
                <div className="bg-white p-4 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 grid grid-cols-2 gap-4 animate-slide-up delay-100">
                    <div className="text-center p-2 rounded-xl hover:bg-gray-50 transition-colors hover:scale-105 duration-200">
                        <span className={`block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.points}</span>
                        <span className="block text-2xl font-black text-crab-red">{formData.points}</span>
                    </div>
                    <div className="text-center p-2 rounded-xl hover:bg-gray-50 transition-colors border-l border-gray-100 hover:scale-105 duration-200">
                        <span className={`block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>Status</span>
                        <span className="block text-lg font-bold text-gray-700">{formData.status}</span>
                    </div>
                </div>

                {/* Main Menu */}
                <div className="space-y-4 animate-slide-up delay-200">
                    <h3 className={`text-sm font-bold text-gray-400 uppercase tracking-wider px-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>Account</h3>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <Link href="/account/orders" className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-all hover:scale-[1.01] active:scale-[0.99] group">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Package className="w-4 h-4" />
                                </div>
                                <span className={`font-semibold text-gray-700 group-hover:text-gray-900 transition-colors ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.myOrders}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>

                        <Link href="/account/addresses" className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-all hover:scale-[1.01] active:scale-[0.99] group">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className={`font-semibold text-gray-700 group-hover:text-gray-900 transition-colors ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.addresses}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>

                        <Link href="/account/payment" className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-all hover:scale-[1.01] active:scale-[0.99] group">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className={`font-semibold text-gray-700 group-hover:text-gray-900 transition-colors ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.paymentMethods}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Support & Logout */}
                <div className="space-y-4 animate-slide-up delay-300">
                    <h3 className={`text-sm font-bold text-gray-400 uppercase tracking-wider px-2 ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>Support</h3>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        <button
                            onClick={() => alert("Support chat is coming soon!")}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-all hover:scale-[1.01] active:scale-[0.99] group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <HelpCircle className="w-4 h-4" />
                                </div>
                                <span className={`font-semibold text-gray-700 group-hover:text-gray-900 transition-colors ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.needHelp}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>

                        <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 active:bg-red-50 transition-all hover:scale-[1.01] active:scale-[0.99] group text-left">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className={`font-semibold text-gray-700 group-hover:text-red-700 transition-colors ${language === 'bn' ? 'font-bangla' : 'font-body'}`}>{t.profile.logout}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-300 pt-4 pb-2 animate-fade-in delay-500">Made by 90s Solution❤️</p>
            </div>
        </div>
    );
}
