import { renderHook, act } from '@testing-library/react'
import { useCheckout } from '../useCheckout'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { useCartStore } from '@/hooks/useCartStore'
import { createOrder } from '@/app/actions/order'
import { useRouter } from 'next/navigation'

// Mock dependencies with factory
jest.mock('@/components/providers/RevenueCatProvider', () => ({
    useRevenueCat: jest.fn()
}))

jest.mock('@/hooks/useCartStore', () => ({
    useCartStore: jest.fn()
}))

jest.mock('@/app/actions/order', () => ({
    createOrder: jest.fn()
}))

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe('useCheckout', () => {
    const mockPurchasePackage = jest.fn()
    const mockClearCart = jest.fn()
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

            // Default mock implementations
            ; (useRevenueCat as unknown as jest.Mock).mockReturnValue({
                isReady: true,
                purchases: {
                    purchasePackage: mockPurchasePackage
                },
                offerings: {
                    current: {
                        availablePackages: [
                            { identifier: 'test-product-1', rcBillingProduct: { identifier: 'test-product-1' } }
                        ]
                    },
                    all: {
                        'default': {
                            availablePackages: [
                                { identifier: 'test-product-1', rcBillingProduct: { identifier: 'test-product-1' } }
                            ]
                        }
                    }
                }
            })

            ; (useCartStore as unknown as jest.Mock).mockReturnValue({
                items: [{ id: 'test-product-1', name: 'Test Product', price: 10, quantity: 1 }],
                clearCart: mockClearCart
            })

            ; (useRouter as jest.Mock).mockReturnValue({
                push: mockPush
            })

            ; (createOrder as jest.Mock).mockResolvedValue({ success: true, orderId: 'order-123' })
    })

    it('should handle successful checkout and redirect', async () => {
        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        expect(mockPurchasePackage).toHaveBeenCalled()
        expect(createOrder).toHaveBeenCalled()
        expect(mockClearCart).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/checkout/success')
        expect(result.current.error).toBeNull()
        expect(result.current.isLoading).toBe(false)
    })

    it('should set error if checkout process fails', async () => {
        const error = new Error('Purchase failed')
        mockPurchasePackage.mockRejectedValue(error)

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        expect(result.current.error).toBe('Purchase failed')
        expect(createOrder).not.toHaveBeenCalled()
        expect(mockClearCart).not.toHaveBeenCalled()
        expect(result.current.isLoading).toBe(false)
    })

    it('should set error if order creation fails', async () => {
        // Mock purchase success but order creation failure
        ; (createOrder as jest.Mock).mockResolvedValueOnce({ success: false })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        // It catches the error from the try/catch block where we throw 'Failed to record order'
        // And sets the specific error message we defined
        expect(result.current.error).toBe('Purchase successful, but failed to record order. Please contact support.')
        expect(mockPurchasePackage).toHaveBeenCalled()
        expect(createOrder).toHaveBeenCalled()
        expect(mockClearCart).not.toHaveBeenCalled() // Only cleared on success
        expect(mockPush).not.toHaveBeenCalled()
    })

    it('should set error if cart is empty', async () => {
        ; (useCartStore as unknown as jest.Mock).mockReturnValue({
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

    it('should set error if RevenueCat is not ready', async () => {
        ; (useRevenueCat as unknown as jest.Mock).mockReturnValue({
            isReady: false,
            purchases: null,
            offerings: null
        })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.handleCheckout()
        })

        expect(result.current.error).toBe('Checkout not ready or cart is empty')
        expect(mockPurchasePackage).not.toHaveBeenCalled()
    })
})
