import { render, screen, waitFor } from '@testing-library/react'
import ProductDetailsPage from '@/app/(shop)/catalog/[id]/page'
import { createClient } from '@/utils/supabase/client'

// Mock Supabase
jest.mock('@/utils/supabase/client', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockImplementation(() =>
                    Promise.resolve({ data: mockProduct, error: null })
                )
            }))
        }))
    }))
}))

const mockProduct = {
    id: '123',
    name: 'Technova Ultra Gear',
    category: 'electronics',
    price: 299.99,
    image: 'https://placehold.co/600x400?text=Ultra+Gear',
    tag: 'Premium'
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useParams: () => ({ id: '123' }),
    useRouter: () => ({
        back: jest.fn()
    })
}))

describe('ProductDetailsPage', () => {
    it('renders loading state initially', async () => {
        render(<ProductDetailsPage />)
        expect(screen.getByText(/Loading product/i)).toBeInTheDocument()
    })

    it('renders product details after fetching', async () => {
        render(<ProductDetailsPage />)

        await waitFor(() => {
            expect(screen.getByText('Technova Ultra Gear')).toBeInTheDocument()
            expect(screen.getByText(/USD 299.99/i)).toBeInTheDocument()
            expect(screen.getByText('Premium')).toBeInTheDocument()
        })
    })

    it('renders error message when product not found', async () => {
        const { createClient } = require('@/utils/supabase/client')
        createClient.mockImplementationOnce(() => ({
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: { message: 'Not Found' } })
                    })
                })
            })
        }))

        render(<ProductDetailsPage />)

        await waitFor(() => {
            expect(screen.getByText(/Product not found/i)).toBeInTheDocument()
        })
    })
})
