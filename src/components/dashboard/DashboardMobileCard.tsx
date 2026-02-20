"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardMobileCardProps {
    title: string
    subtitle?: string
    status?: React.ReactNode
    children: React.ReactNode
    actions?: React.ReactNode
    className?: string
}

export function DashboardMobileCard({
    title,
    subtitle,
    status,
    children,
    actions,
    className
}: DashboardMobileCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className={cn(
            "bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300",
            isExpanded ? "shadow-xl ring-1 ring-slate-900/5 mb-4" : "mb-2",
            className
        )}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-5 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        isExpanded ? "bg-slate-900 border border-slate-800 group-hover:bg-white" : "bg-slate-50 border border-slate-100 group-hover:bg-white"
                    )}>
                        <ChevronDown className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            isExpanded
                                ? "rotate-180 text-white group-hover:text-slate-900"
                                : "text-slate-400 group-hover:text-slate-900"
                        )} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-tighter leading-tight">{title}</h3>
                        {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {status && <div className="flex-shrink-0">{status}</div>}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="px-5 pb-5 pt-0 border-t border-slate-50">
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {children}
                            </div>
                            {actions && (
                                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                                    {actions}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function DashboardMobileCardItem({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
            <div className="text-sm font-bold text-slate-900 leading-snug">{value}</div>
        </div>
    )
}
