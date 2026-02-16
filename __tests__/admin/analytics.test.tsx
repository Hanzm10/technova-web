import { getDashboardStats } from '@/app/actions/analytics'
import { createClerkSupabaseClient } from '@/utils/supabase/server'

// Mock Supabase
jest.mock('@/utils/supabase/server', () => ({
    createClerkSupabaseClient: jest.fn(),
}))

const mockOrders = [
    { total_price: 100, created_at: new Date().toISOString() },
    { total_price: 200, created_at: new Date().toISOString() },
]

describe('Analytics Action', () => {
    it('calculates correct stats including AOV', async () => {
        const mockFrom = jest.fn().mockReturnThis()
        const mockSelect = jest.fn().mockImplementation((path, options) => {
            if (options?.count === 'exact') {
                return Promise.resolve({ count: 10, error: null })
            }
            return {
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                gte: jest.fn().mockReturnThis(),
                then: (cb: any) => cb({ data: mockOrders, error: null })
            }
        })

            ; (createClerkSupabaseClient as jest.Mock).mockReturnValue({
                from: mockFrom.mockReturnValue({
                    select: mockSelect
                })
            })

        const stats = await getDashboardStats()

        // Total Revenue: 100 + 200 = 300
        expect(stats.totalRevenue).toBe(300)
        // Order Count: 2
        expect(stats.orderCount).toBe(2)
        // AOV: 300 / 2 = 150
        expect(stats.aov).toBe(150)
        // User Count: 10 (from mock count)
        expect(stats.userCount).toBe(10)
    })
})
