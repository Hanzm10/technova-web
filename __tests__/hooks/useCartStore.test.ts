import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/hooks/useCartStore'

const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    image: 'test.jpg',
    category: 'test'
}

describe('useCartStore', () => {
    beforeEach(() => {
        act(() => {
            useCartStore.getState().clearCart()
        })
    })

    it('starts with an empty cart', () => {
        const { result } = renderHook(() => useCartStore())
        expect(result.current.items).toEqual([])
        expect(result.current.totalPrice).toBe(0)
    })

    it('adds an item to the cart', () => {
        const { result } = renderHook(() => useCartStore())

        act(() => {
            result.current.addItem(mockProduct as any)
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].quantity).toBe(1)
        expect(result.current.totalPrice).toBe(100)
    })

    it('increments quantity when adding same item', () => {
        const { result } = renderHook(() => useCartStore())

        act(() => {
            result.current.addItem(mockProduct as any)
            result.current.addItem(mockProduct as any)
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].quantity).toBe(2)
        expect(result.current.totalPrice).toBe(200)
    })

    it('removes an item from the cart', () => {
        const { result } = renderHook(() => useCartStore())

        act(() => {
            result.current.addItem(mockProduct as any)
            result.current.removeItem('1')
        })

        expect(result.current.items).toHaveLength(0)
        expect(result.current.totalPrice).toBe(0)
    })

    it('updates item quantity', () => {
        const { result } = renderHook(() => useCartStore())

        act(() => {
            result.current.addItem(mockProduct as any)
            result.current.updateQuantity('1', 5)
        })

        expect(result.current.items[0].quantity).toBe(5)
        expect(result.current.totalPrice).toBe(500)
    })

    it('clears the cart', () => {
        const { result } = renderHook(() => useCartStore())

        act(() => {
            result.current.addItem(mockProduct as any)
            result.current.clearCart()
        })

        expect(result.current.items).toHaveLength(0)
    })
})
