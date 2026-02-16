import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getUserRole } from "@/utils/supabase/server";

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getUserRole()

    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar isAdmin={role === 'admin'} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
