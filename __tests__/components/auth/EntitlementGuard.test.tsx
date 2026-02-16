import { render, screen, waitFor } from '@testing-library/react'
import { EntitlementGuard } from '@/components/auth/EntitlementGuard'
import { useEntitlements } from '@/hooks/useEntitlements'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { useRouter } from 'next/navigation'

// Mock hooks
jest.mock('@/hooks/useEntitlements', () => ({
    useEntitlements: jest.fn()
}))
jest.mock('@/components/providers/RevenueCatProvider', () => ({
    useRevenueCat: jest.fn()
}))
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe('EntitlementGuard', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    })

    it('shows loading spinner when RevenueCat is not ready', () => {
        ; (useRevenueCat as jest.Mock).mockReturnValue({ isReady: false })
            ; (useEntitlements as jest.Mock).mockReturnValue(false)

        render(
            <EntitlementGuard entitlement="premium">
                <div>Protected Content</div>
            </EntitlementGuard>
        )

        expect(screen.getByTestId('loader')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('redirects to /pricing when user lacks entitlement', async () => {
        ; (useRevenueCat as jest.Mock).mockReturnValue({ isReady: true })
            ; (useEntitlements as jest.Mock).mockReturnValue(false)

        render(
            <EntitlementGuard entitlement="premium">
                <div>Protected Content</div>
            </EntitlementGuard>
        )

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/pricing')
        })
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('renders children when user has entitlement', () => {
        ; (useRevenueCat as jest.Mock).mockReturnValue({ isReady: true })
            ; (useEntitlements as jest.Mock).mockReturnValue(true)

        render(
            <EntitlementGuard entitlement="premium">
                <div>Protected Content</div>
            </EntitlementGuard>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
        expect(mockPush).not.toHaveBeenCalled()
    })
})
