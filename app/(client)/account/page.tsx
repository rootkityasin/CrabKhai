'use client';

import Link from 'next/link';
import { Package, MapPin, CreditCard, LogOut, ChevronRight, User } from 'lucide-react';

export default function AccountPage() {
    // Mock User Data
    const user = {
        name: 'Foodie Consultant',
        phone: '+880 17 1234 5678',
        memberSince: 'December 2025',
        points: 120
    };

    // Mock Order History
    const recentOrders = [
        { id: '#CK-8821', date: '12 Dec, 2025', items: 'Signature Masala Crab + 2 others', total: 1450, status: 'Delivered' },
        { id: '#CK-8009', date: '05 Dec, 2025', items: 'Mud Crab Feast', total: 2200, status: 'Delivered' }
    ];

    return (
        <div className="p-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Profile Card */}
            <div className="bg-ocean-blue text-white p-6 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-heading font-bold">{user.name}</h1>
                        <p className="text-white/70 text-sm">{user.phone}</p>
                        <div className="inline-block mt-2 px-3 py-1 bg-crab-red/90 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                            {user.points} Points
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-4 mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">My Account</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-ocean-blue flex items-center justify-center group-hover:bg-ocean-blue group-hover:text-white transition-colors">
                                <Package className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">Orders</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">Saved Addresses</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-700">Payment Methods</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1 mb-3">Recent Orders</h2>
                <div className="space-y-3">
                    {recentOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-ocean-blue">{order.id}</span>
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{order.status}</span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1">{order.items}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{order.date}</p>
                            </div>
                            <span className="font-bold text-crab-red">৳{order.total}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <button className="w-full py-4 rounded-xl border border-red-100 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all">
                <LogOut className="w-4 h-4" />
                Log Out
            </button>

            <p className="text-center text-xs text-gray-300 mt-8">Version 1.2.0 • Made with ❤️</p>
        </div>
    );
}
