import { render, screen } from '@testing-library/react'
import OrdersPage from '@/app/dashboard/orders/page'
import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'

// Mock Supabase
jest.mock('@/utils/supabase/server', () => ({
    createClerkSupabaseClient: jest.fn(),
}))

const mockOrders = [
    { id: '1', user_id: 'user_1', status: 'pending', total_price: 100, created_at: '2024-01-01' },
    { id: '2', user_id: 'user_2', status: 'completed', total_price: 200, created_at: '2024-01-02' },
]

describe('Orders Page', () => {
    it('fetches and displays orders', async () => {
        const mockFrom = jest.fn().mockReturnThis()
        const mockSelect = jest.fn().mockReturnThis()
        const mockOrder = jest.fn().mockResolvedValue({ data: mockOrders, error: null })

            ; (createClient as jest.Mock).mockReturnValue({
                from: mockFrom,
                select: mockSelect,
                order: mockOrder
            })

        const component = await OrdersPage()
        render(component)

        expect(mockFrom).toHaveBeenCalledWith('orders')
        expect(mockSelect).toHaveBeenCalledWith('*')
        expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })

        expect(screen.getByText('Orders')).toBeInTheDocument()
        expect(screen.getByText('user_1')).toBeInTheDocument()
        expect(screen.getByText('pending')).toBeInTheDocument()
        expect(screen.getByText('$100.00')).toBeInTheDocument()
    })
})
