'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEntitlements } from '@/hooks/useEntitlements'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'

interface EntitlementGuardProps {
    children: React.ReactNode
    entitlement: string
}

/**
 * Guard component that redirects to /pricing if the user doesn't have the required entitlement.
 */
export function EntitlementGuard({ children, entitlement }: EntitlementGuardProps) {
    const router = useRouter()
    const hasEntitlement = useEntitlements(entitlement)
    const { isReady } = useRevenueCat()

    useEffect(() => {
        if (isReady && !hasEntitlement) {
            router.push('/pricing')
        }
    }, [isReady, hasEntitlement, router])

    if (!isReady) {
        return (
            <div data-testid="loader" className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        )
    }

    if (!hasEntitlement) {
        return null // Will redirect
    }

    return <>{children}</>
}
