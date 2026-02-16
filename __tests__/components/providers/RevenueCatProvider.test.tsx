import { render, screen, waitFor } from '@testing-library/react'
import { RevenueCatProvider, useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { Purchases } from '@revenuecat/purchases-js'
import { useUser } from '@clerk/nextjs'

// Mock RevenueCat
jest.mock('@revenuecat/purchases-js', () => ({
    Purchases: {
        configure: jest.fn().mockReturnValue({
            getCustomerInfo: jest.fn().mockResolvedValue({
                entitlements: { active: {} }
            }),
            getOfferings: jest.fn().mockResolvedValue({}),
            addCustomerInfoUpdateListener: jest.fn(),
            removeCustomerInfoUpdateListener: jest.fn()
        })
    }
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
    useUser: jest.fn()
}))

const TestComponent = () => {
    const { isReady, customerInfo } = useRevenueCat()
    return (
        <div>
            <div data-testid="ready">{isReady.toString()}</div>
            <div data-testid="customer-info">{customerInfo ? 'loaded' : 'null'}</div>
        </div>
    )
}

describe('RevenueCatProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        process.env.NEXT_PUBLIC_REVENUECAT_API_KEY = 'test-api-key'
    })

    it('configures Purchases with Clerk user ID when signed in', async () => {
        (useUser as jest.Mock).mockReturnValue({
            isSignedIn: true,
            isLoaded: true,
            user: { id: 'user_123' }
        })

        render(
            <RevenueCatProvider>
                <TestComponent />
            </RevenueCatProvider>
        )

        await waitFor(() => {
            expect(Purchases.configure).toHaveBeenCalledWith(expect.objectContaining({
                apiKey: 'test-api-key',
                appUserId: 'user_123'
            }))
        })
    })

    it('configures Purchases with anonymous ID when not signed in', async () => {
        (useUser as jest.Mock).mockReturnValue({
            isSignedIn: false,
            isLoaded: true,
            user: null
        })

        render(
            <RevenueCatProvider>
                <TestComponent />
            </RevenueCatProvider>
        )

        await waitFor(() => {
            expect(Purchases.configure).toHaveBeenCalledWith(expect.objectContaining({
                apiKey: 'test-api-key',
                appUserId: 'anonymous'
            }))
        })
    })

    it('sets isReady to true after initialization', async () => {
        (useUser as jest.Mock).mockReturnValue({
            isSignedIn: false,
            isLoaded: true,
            user: null
        })

        render(
            <RevenueCatProvider>
                <TestComponent />
            </RevenueCatProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('ready').textContent).toBe('true')
            expect(screen.getByTestId('customer-info').textContent).toBe('loaded')
        })
    })
})
