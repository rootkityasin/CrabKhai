'use client';

import { MapPin, Plus } from 'lucide-react';

export default function AddressesPage() {
    return (
        <div className="p-4 min-h-screen bg-gray-50 pb-20">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold font-heading">Addresses</h1>
                <button
                    onClick={() => alert("Add Address feature coming soon!")}
                    className="p-2 bg-crab-red text-white rounded-full shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 ring-1 ring-orange-100 relative">
                    <div className="absolute top-4 right-4 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">HOME</div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Home Sweet Home</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">House 42, Road 7, Block B, Bashundhara R/A, Dhaka</p>
                            <p className="text-xs text-gray-400 mt-2">+880 17 1234 5678</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-70">
                    <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">WORK</div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Office</h3>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">Level 12, Gulshan Centre Point, Gulshan 2, Dhaka</p>
                            <p className="text-xs text-gray-400 mt-2">+880 19 8765 4321</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
