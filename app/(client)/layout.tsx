import { MobileHeader } from "@/components/client/MobileHeader";
import { BottomNav } from "@/components/client/BottomNav";
import PageTransition from "@/components/PageTransition";

import { AdminProvider } from "@/components/providers/AdminProvider";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <div className="flex flex-col min-h-screen bg-white pb-20 md:max-w-lg md:mx-auto md:shadow-2xl md:border-x md:border-gray-200 relative">
                <MobileHeader />
                <main className="flex-1 w-full relative">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
                <BottomNav />
            </div>
        </AdminProvider>
    );
}
