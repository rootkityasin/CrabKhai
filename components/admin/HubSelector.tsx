'use client';

import { useAdmin } from '@/components/providers/AdminProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Shield, Globe } from 'lucide-react';

export function HubSelector() {
    const {
        currentUser,
        availableHubs,
        activeHubId,
        switchHub,
        loginAs,
        isSidebarCollapsed
    } = useAdmin();

    const currentHub = availableHubs.find(h => h.id === activeHubId) || { name: 'Global' };

    // Collapsed View
    if (isSidebarCollapsed) {
        return (
            <div className="px-2 py-4 border-b border-gray-100 bg-slate-50 flex flex-col items-center gap-2">
                <div title={activeHubId === 'ALL' ? 'All Hubs' : currentHub.name} className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm text-orange-600 font-bold text-lg">
                    {activeHubId === 'ALL' ? (
                        <Globe className="w-5 h-5" />
                    ) : (
                        <span>{currentHub.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                {/* Simulator hidden in collapsed mode */}
            </div>
        )
    }

    // Single Hub View (Expanded)
    if (availableHubs.length <= 1 && activeHubId !== 'ALL') {
        const hub = availableHubs.find(h => h.id === activeHubId);
        return (
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <MapPin className="w-3 h-3" />
                    {hub?.name || 'Local Hub'}
                </div>
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                    {currentUser.role.replace('_', ' ')}
                </Badge>
            </div>
        );
    }

    // Expanded View with Selector
    return (
        <div className="px-4 py-3 border-b border-gray-100 bg-slate-50 space-y-3">
            {/* Hub Switcher (Only for Super Admins) */}
            {currentUser.role === 'SUPER_ADMIN' && (
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block pl-1">
                        Active Hub
                    </label>
                    <Select value={activeHubId} onValueChange={switchHub}>
                        <SelectTrigger className="w-full bg-white border-gray-200 h-9 text-xs font-medium">
                            <SelectValue placeholder="Select Hub" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="ALL" className="font-bold">
                                <span className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> All Hubs (Global)
                                </span>
                            </SelectItem>
                            {availableHubs.map(hub => (
                                <SelectItem key={hub.id} value={hub.id}>
                                    {hub.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Debug Role Switcher (Simulator) */}
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block pl-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Simulator: Login As
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => loginAs('super-admin')}
                        className={`text-[10px] p-1.5 rounded border font-medium transition-colors ${currentUser.id === 'super-admin' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        Super Admin
                    </button>
                    <button
                        onClick={() => loginAs('khulna-admin')}
                        className={`text-[10px] p-1.5 rounded border font-medium transition-colors ${currentUser.id === 'khulna-admin' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                        Khulna Manager
                    </button>
                </div>
            </div>
        </div>
    );
}
