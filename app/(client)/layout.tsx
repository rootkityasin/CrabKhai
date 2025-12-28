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
            <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
                <MobileHeader />
                <main className="flex-1 w-full max-w-md mx-auto relative">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
                <BottomNav />
            </div>
        </AdminProvider>
    );
}
