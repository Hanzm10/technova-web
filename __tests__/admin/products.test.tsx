import { render, screen } from '@testing-library/react'
import ProductsPage from '@/app/dashboard/products/page'
import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'

// Mock Supabase
jest.mock('@/utils/supabase/server', () => ({
    createClerkSupabaseClient: jest.fn(),
}))

// Mock Next.js Link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

const mockProducts = [
    { id: '1', name: 'Test Product 1', price: 100, category: 'Test', image: 'test.jpg' },
    { id: '2', name: 'Test Product 2', price: 200, category: 'Test', image: 'test2.jpg' },
]

describe('Products Page', () => {
    it('fetches and displays products', async () => {
        const mockFrom = jest.fn().mockReturnThis()
        const mockSelect = jest.fn().mockResolvedValue({ data: mockProducts, error: null })

            ; (createClient as jest.Mock).mockReturnValue({
                from: mockFrom,
                select: mockSelect,
            })

        const component = await ProductsPage()
        render(component)

        // Verify Supabase call
        expect(mockFrom).toHaveBeenCalledWith('products')
        expect(mockSelect).toHaveBeenCalledWith('*')

        // Verify rendered content
        expect(screen.getByText('Products')).toBeInTheDocument()
        expect(screen.getByText('Test Product 1')).toBeInTheDocument()
        expect(screen.getByText('Test Product 2')).toBeInTheDocument()

        // Verify "Add Product" button
        expect(screen.getByText('Add Product')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /add product/i })).toHaveAttribute('href', '/dashboard/products/new')
    })
})
