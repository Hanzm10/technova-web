import { useRevenueCat } from '@/components/providers/RevenueCatProvider'

/**
 * Hook to check if a user has a specific entitlement.
 * @param entitlementId The ID of the entitlement to check (e.g., 'premium', 'fashionista')
 * @returns boolean indicating if the entitlement is active
 */
export function useEntitlements(entitlementId: string): boolean {
    const { customerInfo, isReady } = useRevenueCat()

    if (!isReady || !customerInfo) {
        return false
    }

    // Check if the entitlement exists in the active entitlements map
    return !!customerInfo.entitlements.active[entitlementId]
}
