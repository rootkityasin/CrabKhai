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
            <div className="min-h-screen bg-gray-50 flex">
                <AdminSidebar />
                <MainContentWrapper>
                    {children}
                </MainContentWrapper>
            </div>
        </AdminProvider>
    );
}

function MainContentWrapper({ children }: { children: React.ReactNode }) {
    const { isSidebarCollapsed } = useAdmin(); // Now we can use the hook!
    return (
        <main className={cn("flex-1 p-8 transition-all duration-300 ease-in-out", isSidebarCollapsed ? "ml-20" : "ml-64")}>
            {children}
        </main>
    )
}
