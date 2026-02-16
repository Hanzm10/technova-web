import { renderHook } from '@testing-library/react'
import { useEntitlements } from '@/hooks/useEntitlements'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'

// Mock useRevenueCat
jest.mock('@/components/providers/RevenueCatProvider', () => ({
    useRevenueCat: jest.fn()
}))

describe('useEntitlements', () => {
    it('returns false when RevenueCat is not ready', () => {
        (useRevenueCat as jest.Mock).mockReturnValue({
            customerInfo: null,
            isReady: false
        })

        const { result } = renderHook(() => useEntitlements('premium'))
        expect(result.current).toBe(false)
    })

    it('returns true when user has the entitlement', () => {
        (useRevenueCat as jest.Mock).mockReturnValue({
            customerInfo: {
                entitlements: {
                    active: {
                        premium: { identifier: 'premium' }
                    }
                }
            },
            isReady: true
        })

        const { result } = renderHook(() => useEntitlements('premium'))
        expect(result.current).toBe(true)
    })

    it('returns false when user does not have the entitlement', () => {
        (useRevenueCat as jest.Mock).mockReturnValue({
            customerInfo: {
                entitlements: {
                    active: {
                        fashionista: { identifier: 'fashionista' }
                    }
                }
            },
            isReady: true
        })

        const { result } = renderHook(() => useEntitlements('premium'))
        expect(result.current).toBe(false)
    })
})
