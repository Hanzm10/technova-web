'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    isAdmin?: boolean
    isSignedIn?: boolean
}

export const MobileMenu = ({ isOpen, onClose, isAdmin }: MobileMenuProps) => {
    const { isSignedIn, user } = useUser()
    const pathname = usePathname()

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const menuItems = [
        { href: '/', label: 'HOME' },
        { href: '/catalog', label: 'SHOP' },
        { href: '/favorites', label: 'FAVORITES' },
        ...(isAdmin ? [{ href: '/dashboard', label: 'DASHBOARD' }] : []),
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-[80vw] max-w-sm bg-[#E8ECEF] z-[101] shadow-2xl border-l border-white/20 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex justify-between items-center border-b border-slate-200/50">
                            <span className="text-xl font-bold tracking-tighter text-slate-900">MENU</span>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
                            >
                                <X size={24} className="text-slate-900" />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "group flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                                            isActive
                                                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                                                : "hover:bg-white hover:shadow-md text-slate-600 hover:text-slate-900"
                                        )}
                                    >
                                        <span className="font-bold tracking-tight text-lg">{item.label}</span>
                                        <ChevronRight size={20} className={cn(
                                            "transition-transform duration-300",
                                            isActive ? "translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                        )} />
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Footer / Auth */}
                        <div className="p-6 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
                            {isSignedIn ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        <img
                                            src={user?.imageUrl}
                                            alt={user?.fullName || 'User'}
                                            className="w-10 h-10 rounded-full border-2 border-slate-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 truncate">{user?.fullName}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                        </div>
                                    </div>
                                    <SignOutButton>
                                        <Button variant="outline" className="w-full justify-between rounded-xl h-12 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100">
                                            <span>Sign Out</span>
                                            <LogOut size={18} />
                                        </Button>
                                    </SignOutButton>
                                </div>
                            ) : (
                                <SignInButton mode="modal">
                                    <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] transition-all">
                                        SIGN IN / SIGN UP
                                    </Button>
                                </SignInButton>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
