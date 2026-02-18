import { createOrder } from '../order';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

// Mock dependencies
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(),
}));

jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn(),
}));

describe('createOrder Action', () => {
    const mockUserId = 'user_test_123';
    const mockProducts = [
        { id: 'prod_1', price: 100 },
        { id: 'prod_2', price: 50 },
    ];

    const mockSelect = jest.fn();
    const mockInsert = jest.fn();
    const mockIn = jest.fn();

    // Need to be able to modify database responses per test
    let currentProducts = mockProducts;
    let currentOrderError: any = null;

    const mockSupabase = {
        from: jest.fn().mockImplementation((table) => {
            if (table === 'products') {
                return {
                    select: jest.fn().mockReturnValue({
                        in: jest.fn().mockReturnValue({ data: currentProducts, error: null })
                    })
                };
            }
            if (table === 'orders') {
                return {
                    insert: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: jest.fn().mockReturnValue({ data: { id: 'order_123' }, error: currentOrderError })
                        })
                    })
                };
            }
            if (table === 'order_items') {
                return {
                    insert: jest.fn().mockReturnValue({ error: null })
                };
            }
            return {
                select: mockSelect,
                insert: mockInsert,
            };
        }),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        currentProducts = mockProducts;
        currentOrderError = null;
        (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });
        (createClient as jest.Mock).mockReturnValue(mockSupabase);
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key';
    });

    it('should create an order successfully', async () => {
        const params = {
            items: [
                { id: 'prod_1', quantity: 1, price: 100 },
                { id: 'prod_2', quantity: 2, price: 50 },
            ],
            totalPrice: 200,
        };

        const result = await createOrder(params);
        expect(result.success).toBe(true);
        expect(result.orderId).toBe('order_123');
        // Ensure we are using the service role client
        expect(createClient).toHaveBeenCalledWith(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );
    });

    it('should fail if user is not authenticated', async () => {
        (auth as jest.Mock).mockResolvedValue({ userId: null });
        const params = { items: [{ id: 'prod_1', quantity: 1, price: 100 }], totalPrice: 100 };
        await expect(createOrder(params)).rejects.toThrow('Unauthorized');
    });

    it('should fail if product lookup returns empty (price mismatch simulation)', async () => {
        currentProducts = []; // Simulate no products found
        const params = { items: [{ id: 'prod_missing', quantity: 1, price: 100 }], totalPrice: 100 };
        // Depending on logic, might throw "Product not found" or "Failed to validate"
        await expect(createOrder(params)).rejects.toThrow();
    });

    it('should fail if order creation errors (e.g. RLS)', async () => {
        currentOrderError = { message: 'RLS violation' };
        const params = { items: [{ id: 'prod_1', quantity: 1, price: 100 }], totalPrice: 100 };
        await expect(createOrder(params)).rejects.toThrow('Failed to create order: RLS violation');
    });
});
