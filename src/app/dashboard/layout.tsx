import { DashboardMobileNav } from '@/components/layout/DashboardMobileNav'
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
        <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden relative">
            <Sidebar className="hidden md:flex shrink-0" />
            <div className="flex-1 flex flex-col min-w-0 font-sans relative">
                <DashboardMobileNav title="TechNova Admin" />
                <main className="flex-1 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
