import { render, screen, waitFor } from '@testing-library/react'
import CatalogPage from '@/app/catalog/page'
import { createClient } from '@/utils/supabase/client'

// Mock Supabase
jest.mock('@/utils/supabase/client', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn().mockReturnThis(),
                then: jest.fn((cb) => cb({ data: mockProducts, error: null }))
            }))
        }))
    }))
}))

const mockProducts = [
    { id: '1', name: 'Product 1', category: 'electronics', price: 100, image: '', tag: 'New' },
    { id: '2', name: 'Product 2', category: 'fashion', price: 50, image: '', tag: null }
]

// Mock useRouter and useSearchParams
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn()
    }),
    useSearchParams: () => ({
        get: jest.fn((key) => null),
        toString: () => ''
    })
}))

describe('CatalogPage', () => {
    it('renders the catalog title', async () => {
        render(<CatalogPage />)
        expect(screen.getByText(/EXPLORE/i)).toBeInTheDocument()
        expect(screen.getByText(/THE/i)).toBeInTheDocument()
        // Use getAllByText and check for at least one, or be more specific
        const catalogElements = screen.getAllByText(/catalog/i)
        expect(catalogElements.length).toBeGreaterThan(0)
    })

    it('renders products fetched from Supabase', async () => {
        render(<CatalogPage />)
        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument()
            expect(screen.getByText('Product 2')).toBeInTheDocument()
        })
    })

    it('displays no products message when empty', async () => {
        const { createClient } = require('@/utils/supabase/client')
        createClient.mockImplementation(() => ({
            from: () => ({
                select: () => ({
                    then: (cb: any) => cb({ data: [], error: null })
                })
            })
        }))

        render(<CatalogPage />)
        await waitFor(() => {
            expect(screen.getByText(/No products found/i)).toBeInTheDocument()
        })
    })
})
