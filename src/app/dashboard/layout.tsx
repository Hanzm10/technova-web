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
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar className="hidden md:flex" />
            <div className="flex-1 flex flex-col font-sans relative">
                <DashboardMobileNav title="TechNova Admin" />
                <main className="flex-1 p-4 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
