import { MobileHeader } from "@/components/client/MobileHeader";
import { BottomNav } from "@/components/client/BottomNav";
import PageTransition from "@/components/PageTransition";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <MobileHeader />
            <main className="flex-1 w-full max-w-md mx-auto bg-white min-h-[calc(100vh-3.5rem)]">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <BottomNav />
        </div>
    );
}
