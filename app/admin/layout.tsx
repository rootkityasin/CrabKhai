'use client';

import { AdminProvider, useAdmin } from '@/components/providers/AdminProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />
                <MainContentWrapper>
                    {children}
                </MainContentWrapper>
            </div>
        </AdminProvider>
    );
}

function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { isSidebarCollapsed } = useAdmin();
    return (
        <main className={cn("p-4 pt-14 lg:p-8 transition-all duration-300 ease-in-out w-auto", isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
            {children}
        </main>
    )
}
