'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useToastStore, Toast as ToastType } from '@/hooks/useToastStore'

export const Toast: React.FC<ToastType> = ({ id, message, type }) => {
    const { removeToast } = useToastStore()

    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={20} />,
        error: <AlertCircle className="text-rose-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="flex items-center gap-4 p-4 pr-6 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[3rem] min-w-[320px] pointer-events-auto"
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                {icons[type]}
            </div>

            <p className="flex-1 text-sm font-semibold text-slate-900">
                {message}
            </p>

            <button
                onClick={() => removeToast(id)}
                className="text-slate-400 hover:text-slate-900 transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    )
}
