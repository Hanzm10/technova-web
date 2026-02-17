'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

export function DashboardMobileNav({ title }: { title: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

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

    return (
        <>
            <header className="md:hidden flex h-16 items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/50">
                <span className="font-bold tracking-tighter text-slate-900 text-xl">{title}</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="hover:bg-slate-100 rounded-full"
                >
                    <Menu className="h-6 w-6 text-slate-900" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] md:hidden"
                        />

                        {/* Menu Panel - Slides in from Right like Landing Page */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-screen w-[85vw] max-w-sm bg-white/80 backdrop-blur-3xl z-[101] shadow-2xl border-l border-white/40 flex flex-col md:hidden"
                        >
                            {/* Close Button Only */}
                            <div className="absolute top-6 right-6 z-50">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm"
                                >
                                    <X size={20} className="text-slate-900" />
                                </button>
                            </div>

                            {/* Sidebar Links */}
                            <div className="flex-1 overflow-y-auto">
                                <Sidebar className="flex border-none" isMobile={true} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
