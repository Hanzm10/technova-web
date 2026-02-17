'use client'

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/hooks/useToastStore'
import { Toast } from '@/components/ui/Toast'

export const ToastProvider: React.FC = () => {
    const { toasts } = useToastStore()

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </AnimatePresence>
        </div>
    )
}
