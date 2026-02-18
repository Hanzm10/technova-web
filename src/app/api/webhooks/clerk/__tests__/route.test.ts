/**
 * @jest-environment node
 */
import { POST } from '../route';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

// Mock dependencies
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(),
}));

jest.mock('svix', () => ({
    Webhook: jest.fn(),
}));

jest.mock('next/headers', () => ({
    headers: jest.fn(),
}));

// Mock console.error to keep test output clean
const originalError = console.error;
beforeAll(() => {
    console.error = jest.fn();
});

afterAll(() => {
    console.error = originalError;
});

describe('Clerk Webhook Handler', () => {
    const mockUpsert = jest.fn().mockReturnValue({ error: null });
    const mockDelete = jest.fn().mockReturnValue({ error: null });
    const mockFrom = jest.fn().mockReturnValue({
        upsert: mockUpsert,
        delete: mockDelete,
        eq: jest.fn().mockReturnValue({ delete: mockDelete, error: null }),
    });
    const mockSupabase = {
        from: mockFrom,
    };

    const mockWebhookVerify = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (createClient as jest.Mock).mockReturnValue(mockSupabase);
        (Webhook as unknown as jest.Mock).mockReturnValue({
            verify: mockWebhookVerify,
        });

        // Mock environment variables
        process.env.WEBHOOK_SECRET = 'test_secret';
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
        process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key';
    });

    it('should return 400 if SVIX headers are missing', async () => {
        (headers as jest.Mock).mockResolvedValue(new Map());

        const req = {
            json: jest.fn().mockResolvedValue({}),
        } as unknown as Request;

        const res = await POST(req);
        expect(res.status).toBe(400);
        expect(await res.text()).toBe('Error occured -- no svix headers');
    });

    it('should return 400 if signature verification fails', async () => {
        const mockHeaders = new Map([
            ['svix-id', 'test_id'],
            ['svix-timestamp', 'test_timestamp'],
            ['svix-signature', 'test_signature'],
        ]);
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        mockWebhookVerify.mockImplementation(() => {
            throw new Error('Verification failed');
        });

        const req = {
            json: jest.fn().mockResolvedValue({}),
        } as unknown as Request;

        const res = await POST(req);
        expect(res.status).toBe(400);
        expect(await res.text()).toBe('Error occured');
    });

    it('should upsert user on user.created event', async () => {
        const mockHeaders = new Map([
            ['svix-id', 'test_id'],
            ['svix-timestamp', 'test_timestamp'],
            ['svix-signature', 'test_signature'],
        ]);
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        const payload = {
            type: 'user.created',
            data: {
                id: 'user_123',
                email_addresses: [{ email_address: 'test@example.com' }],
                first_name: 'John',
                last_name: 'Doe',
            },
        };

        mockWebhookVerify.mockReturnValue(payload);

        const req = {
            json: jest.fn().mockResolvedValue(payload),
        } as unknown as Request;

        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(mockUpsert).toHaveBeenCalledWith({
            id: 'user_123',
            email: 'test@example.com',
            role: 'user',
        });
    });

    it('should upsert user on user.updated event', async () => {
        const mockHeaders = new Map([
            ['svix-id', 'test_id'],
            ['svix-timestamp', 'test_timestamp'],
            ['svix-signature', 'test_signature'],
        ]);
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        const payload = {
            type: 'user.updated',
            data: {
                id: 'user_123',
                email_addresses: [{ email_address: 'updated@example.com' }],
                first_name: 'Jane',
                last_name: 'Doe',
            },
        };

        mockWebhookVerify.mockReturnValue(payload);

        const req = {
            json: jest.fn().mockResolvedValue(payload),
        } as unknown as Request;

        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(mockUpsert).toHaveBeenCalledWith({
            id: 'user_123',
            email: 'updated@example.com',
            role: 'user',
        });
    });

    it('should delete user on user.deleted event', async () => {
        const mockHeaders = new Map([
            ['svix-id', 'test_id'],
            ['svix-timestamp', 'test_timestamp'],
            ['svix-signature', 'test_signature'],
        ]);
        (headers as jest.Mock).mockResolvedValue(mockHeaders);

        const payload = {
            type: 'user.deleted',
            data: {
                id: 'user_123',
            },
        };

        mockWebhookVerify.mockReturnValue(payload);

        const req = {
            json: jest.fn().mockResolvedValue(payload),
        } as unknown as Request;

        // We need to properly mock the chain: .delete().eq('id', id)
        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockDeleteChain = jest.fn().mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({ delete: mockDeleteChain });

        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(mockDeleteChain).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith('id', 'user_123');
    });
});
