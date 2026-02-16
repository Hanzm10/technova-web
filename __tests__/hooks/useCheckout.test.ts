import { renderHook, act } from '@testing-library/react'
import { useCheckout } from '@/hooks/useCheckout'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { useCartStore } from '@/hooks/useCartStore'

// Mock dependencies
jest.mock('@/components/providers/RevenueCatProvider', () => ({
    useRevenueCat: jest.fn()
}))

jest.mock('@/hooks/useCartStore', () => ({
    useCartStore: jest.fn()
}))

describe('useCheckout', () => {
    const mockPurchasePackage = jest.fn()
    const mockClearCart = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        const mockOfferings = {
            current: {
                availablePackages: [
                    { identifier: 'prod_1', rcBillingProduct: { identifier: 'prod_1' } }
                ]
            },
            all: {
                current: {
                    availablePackages: [
                        { identifier: 'prod_1', rcBillingProduct: { identifier: 'prod_1' } }
                    ]
                }
            }
        }
            ; (useRevenueCat as jest.Mock).mockReturnValue({
                isReady: true,
                purchases: {
                    purchasePackage: mockPurchasePackage
                },
                offerings: mockOfferings
            })
            ; (useCartStore as jest.Mock).mockReturnValue({
                items: [{ id: 'prod_1', name: 'Product 1', price: 100, quantity: 1 }],
                clearCart: mockClearCart
            })
    })

    it('starts checkout for items in cart', async () => {
        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        expect(mockPurchasePackage).toHaveBeenCalledWith(expect.objectContaining({
            identifier: 'prod_1'
        }))
        expect(mockClearCart).toHaveBeenCalled()
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe(null)
    })

    it('sets error when cart is empty', async () => {
        ; (useCartStore as jest.Mock).mockReturnValue({
            items: [],
            clearCart: mockClearCart
        })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        expect(result.current.error).toBe('Checkout not ready or cart is empty')
        expect(mockPurchasePackage).not.toHaveBeenCalled()
    })

    it('handles purchase failure', async () => {
        mockPurchasePackage.mockRejectedValue(new Error('Payment failed'))

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        expect(result.current.error).toBe('Payment failed')
        expect(mockClearCart).not.toHaveBeenCalled()
    })
})
