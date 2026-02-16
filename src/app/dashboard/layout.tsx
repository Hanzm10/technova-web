import { Sidebar } from '@/components/layout/Sidebar'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/utils/supabase/server'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()
    const role = await getUserRole()

    if (!userId || role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar className="hidden md:flex" />
            <div className="flex-1 flex flex-col font-sans">
                <header className="md:hidden flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-muted/40">
                    <span className="font-semibold">TechNova Admin</span>
                    {/* Mobile toggle would go here */}
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    )
}
