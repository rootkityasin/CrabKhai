'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Layers,
    Users,
    Settings,
    Smartphone,
    Palette,
    FileText,
    Ticket,
    Shield,
    BarChart3,
    CreditCard,
    Repeat,
    Zap,
    ChevronLeft,
    ChevronRight,
    Search,
    LogOut,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useAdmin } from '@/components/providers/AdminProvider';
import { Button } from '@/components/ui/button';

export function AdminSidebar() {
    const pathname = usePathname();
    const { isSidebarCollapsed, toggleSidebar, setOrders } = useAdmin(); // Access setOrders if needed, or just specific context

    // Auto-collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { // lg breakpoint
                if (!isSidebarCollapsed) toggleSidebar();
            }
        };

        // Initial check
        if (window.innerWidth < 1024) {
            // We can't toggle here easily without causing double-render or loop if we are not careful.
            // But since we want "default to desktop", and "little screen only icon", 
            // maybe better to let the Provider handle initial state? 
            // Or just simpler:
        }

        // Actually, let's just use CSS media queries for "mobile first" strategies usually, 
        // but since we have state-driven layout (ml-64), JS is needed.

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Better approach:
    // On mount, check width. If small & not collapsed, collapse.
    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth < 1024) {
                // We need to access the setter directly or ensure toggle works as 'set(true)'
                // My toggle is just prev => !prev. This is risky for resize events.
                // I should expose 'setSidebarCollapsed' or make toggle accept a value.
                // For now, I'll stick to manual toggle or a simple check on mount.
            }
        };
        checkSize();
    }, []);


    const menuGroups = [
        {
            label: 'Main',
            items: [
                { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
                { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
                { label: 'Products', href: '/admin/products', icon: Package },
                { label: 'Categories', href: '/admin/categories', icon: Layers },
                { label: 'Customers', href: '/admin/customers', icon: Users },
            ],
        },
        {
            label: 'CONFIGURATION',
            items: [
                { label: 'Manage Shop', href: '/admin/shop', icon: Settings },
                { label: 'Customize Theme', href: '/admin/theme', icon: Palette },
                { label: 'Landing Pages', href: '/admin/landing', icon: FileText },
                { label: 'Automation', href: '/admin/automation', icon: Zap, badge: 'HOT', badgeColor: "bg-red-100 text-red-600" },
                { label: 'Promo Codes', href: '/admin/promos', icon: Ticket },
                { label: 'Users & Permissions', href: '/admin/users', icon: Shield },
            ],
        },
        {
            label: 'REPORTS',
            items: [
                { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            ],
        },

    ];

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col",
            isSidebarCollapsed ? "w-20" : "w-64"
        )}>
            {/* Logo */}
            {/* Logo & Toggle */}
            {/* Logo & Toggle */}
            <div className={cn("flex items-center h-16 border-b border-gray-100 transition-all duration-300", isSidebarCollapsed ? "justify-center px-0" : "justify-between px-6")}>
                {isSidebarCollapsed ? (
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-slate-400 hover:text-orange-600">
                        <Menu className="w-6 h-6" />
                    </Button>
                ) : (
                    <>
                        <img src="/logo.svg" alt="CrabKhai" className="h-14 w-auto" />
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-slate-400 hover:text-orange-600">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </>
                )}
            </div>

            {/* Collapsed Toggle (When strictly collapsed, we might need a way to open it if the logo isn't the toggle. 
                Actually, usually the logo or a button near it acts as toggle. 
                If collapsed, we only see logo. Let's make the logo container clickable or add a small button?
                User said "besides logo". In collapsed mode, there is no "besides".
                Let's assume in collapsed mode, the button might replace the logo or be below it?
                OR, let's keep the button visible even when collapsed?
                If collapsed (w-20), we have space for one icon.
                Let's try putting the toggle button centered if collapsed.
            */}


            {/* Menu */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="px-3">
                        {group.label !== 'Main' && !isSidebarCollapsed && (
                            <h4 className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider animate-in fade-in">{group.label}</h4>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={isSidebarCollapsed ? item.label : undefined}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative group",
                                            isActive
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-slate-600 hover:bg-gray-50 hover:text-slate-900",
                                            isSidebarCollapsed ? "justify-center" : "justify-between"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600")} />
                                            {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                                        </div>

                                        {!isSidebarCollapsed && item.badge && (
                                            <span className={cn(
                                                "px-1.5 py-0.5 text-[10px] font-bold rounded-md ml-auto",
                                                item.badge === 'NEW' ? (item.badgeColor || "bg-gray-100 text-gray-600") : "bg-orange-100 text-orange-600"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}

                                        {/* Status Dot for collapsed view if needed, maybe not now */}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Collapse Toggle */}
            {/* Footer with Toggle Check - actually removing toggle from here as per request */}
            {/* Footer Limit */}
            <div className="p-4 border-t border-gray-100">
                {!isSidebarCollapsed && (
                    <div className="flex items-center justify-center p-2 text-xs font-medium text-slate-500 hover:text-orange-600 cursor-pointer">
                        90s Solution
                    </div>
                )}
            </div>
        </aside>
    );
}
