'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, ShoppingCart, Users, Settings, ChevronRight, LogOut, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserButton, useUser, SignOutButton } from '@clerk/nextjs'

const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ className, isMobile = false }: { className?: string, isMobile?: boolean }) {
    const pathname = usePathname()
    const { user } = useUser()

    const sidebarContent = (
        <>
            {/* Brand Header */}
            <div className={cn("px-6 py-10", isMobile ? "py-8" : "")}>
                <Link href="/" className="group flex flex-col">
                    <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none transition-transform duration-500 group-hover:scale-[1.02] origin-left">TECHNOVA</span>
                    {!isMobile && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Admin Panel</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className={cn("flex-1 space-y-2", isMobile ? "px-6" : "px-4")}>
                {!isMobile && (
                    <div className="px-4 mb-6">
                        <span className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">System</span>
                    </div>
                )}
                {links.map((link) => {
                    const isActive = pathname === link.href
                    const Icon = link.icon

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group relative flex items-center justify-between rounded-[1.5rem] transition-all duration-300",
                                isMobile ? "p-5" : "px-5 py-4",
                                isActive
                                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20"
                                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <Icon className={cn("h-5 w-5 transition-transform duration-500 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                                <span className={cn(
                                    "font-black uppercase tracking-wider",
                                    isMobile ? "text-lg" : "text-[11px]"
                                )}>
                                    {link.name}
                                </span>
                            </div>
                            <ChevronRight className={cn(
                                "h-4 w-4 transition-all duration-500 relative z-10",
                                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                            )} />

                            {isActive && !isMobile && (
                                <motion.div
                                    layoutId="sidebarActiveBg"
                                    className="absolute inset-0 bg-slate-900 rounded-[1.5rem] -z-0"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile Section */}
            <div className={cn("mt-auto p-4", isMobile ? "pb-12" : "pb-8")}>
                <div className={cn(
                    "rounded-[2rem] bg-white border border-slate-100 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl",
                    isMobile ? "flex items-center justify-between" : ""
                )}>
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" appearance={{
                            elements: {
                                userButtonAvatarBox: "h-10 w-10 border-2 border-white shadow-sm"
                            }
                        }} />
                        <div className="flex flex-col overflow-hidden text-left">
                            <span className="font-black text-[11px] text-slate-900 uppercase truncate">
                                {user?.firstName || 'Admin'} {user?.lastName}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase truncate tracking-tighter">
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    if (isMobile) {
        return <div className={cn("flex flex-col h-full", className)}>{sidebarContent}</div>
    }

    return (
        <aside className={cn(
            "flex flex-col h-screen w-72 bg-white/40 backdrop-blur-3xl border-r border-white/40 shadow-2xl fixed top-0 left-0 z-30",
            className
        )}>
            {sidebarContent}
        </aside>
    )
}
