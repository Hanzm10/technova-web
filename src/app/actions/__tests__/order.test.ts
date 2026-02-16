
import { createOrder } from '../order'
import { createClerkSupabaseClient } from '@/utils/supabase/server'
import { auth } from '@clerk/nextjs/server'

// Mock dependencies with factory
jest.mock('@/utils/supabase/server', () => ({
    createClerkSupabaseClient: jest.fn()
}))

jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn()
}))

describe('createOrder', () => {
    // We need to create a chainable mock object
    const mockSelect = jest.fn()
    const mockSingle = jest.fn()
    const mockInsert = jest.fn()
    const mockFrom = jest.fn()

    const mockSupabase = {
        from: mockFrom
    }

    beforeEach(() => {
        jest.clearAllMocks()

        // Setup the chain: from -> insert -> select -> single
        mockFrom.mockReturnValue({ insert: mockInsert })
        mockInsert.mockReturnValue({ select: mockSelect })
        mockSelect.mockReturnValue({ single: mockSingle })
        mockSingle.mockResolvedValue({ data: { id: 'order-123' }, error: null })

        // Important: insert can ALSO return just a promise if select/single aren't called (for order items)
        // Check how we use it in the implementation:
        // 1. Order: .from('orders').insert({...}).select().single()
        // 2. Items: .from('order_items').insert([...]) -> this returns a Thenable directly usually

        // To handle both, we can make insert return an object that HAS select, but also IS valid as a result if awaited?
        // Or better, we can customize the return based on the table name.

        mockFrom.mockImplementation((table: string) => {
            if (table === 'orders') {
                return {
                    insert: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({ data: { id: 'order-123' }, error: null })
                        })
                    })
                }
            } else if (table === 'order_items') {
                return {
                    insert: jest.fn().mockResolvedValue({ error: null })
                }
            }
            return { insert: jest.fn() }
        })

            ; (createClerkSupabaseClient as unknown as jest.Mock).mockResolvedValue(mockSupabase)
            ; (auth as unknown as jest.Mock).mockResolvedValue({ userId: 'test-user-id' })
    })

    it('should create an order successfully', async () => {
        const result = await createOrder({
            items: [{ id: 'prod-1', quantity: 2, price: 50 }],
            totalPrice: 100
        })

        expect(result.success).toBe(true)
        expect(createClerkSupabaseClient).toHaveBeenCalled()
        expect(mockFrom).toHaveBeenCalledWith('orders')
        expect(mockFrom).toHaveBeenCalledWith('order_items')
    })

    it('should throw error if user is not authenticated', async () => {
        ; (auth as unknown as jest.Mock).mockResolvedValue({ userId: null })

        await expect(createOrder({ items: [], totalPrice: 0 }))
            .rejects.toThrow('Unauthorized')
    })
})
