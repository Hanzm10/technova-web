'use client'

import { ClerkProvider } from '@clerk/nextjs'
import dynamic from 'next/dynamic'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { ToastProvider } from '@/components/layout/ToastProvider'

const RevenueCatProvider = dynamic(
    () => import('@/components/providers/RevenueCatProvider').then(mod => mod.RevenueCatProvider),
    { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <ClerkProvider>
            <QueryClientProvider client={queryClient}>
                <RevenueCatProvider>
                    {children}
                    <ToastProvider />
                </RevenueCatProvider>
            </QueryClientProvider>
        </ClerkProvider>
    )
}
