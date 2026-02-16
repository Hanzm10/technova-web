import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import CatalogPage from '@/app/catalog/page'
import { createClient } from '@/utils/supabase/client'
import { useCartStore } from '@/hooks/useCartStore'

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
    { id: '1', name: 'Product 1', category: 'Gadgets', price: 100, image: 'img1.jpg', tag: 'New' },
    { id: '2', name: 'Product 2', category: 'Fashion', price: 50, image: 'img2.jpg', tag: null }
]

// Mock useRouter and useSearchParams
const mockPush = jest.fn()
const mockSearchParams = {
    get: jest.fn((key) => null),
    toString: () => ''
}

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush
    }),
    useSearchParams: () => mockSearchParams
}))

// Mock useCartStore
jest.mock('@/hooks/useCartStore', () => ({
    useCartStore: jest.fn(() => ({
        addItem: jest.fn()
    }))
}))

describe('CatalogPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the catalog title', async () => {
        render(<CatalogPage />)
        expect(screen.getByText(/EXPLORE/i)).toBeInTheDocument()
        expect(screen.getByText(/THE/i)).toBeInTheDocument()
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

    it('updates URL when category filter is clicked', async () => {
        render(<CatalogPage />)
        const gadgetFilter = screen.getByText('GADGETS')
        fireEvent.click(gadgetFilter)
        expect(mockPush).toHaveBeenCalledWith('/catalog?category=Gadgets')
    })

    it('calls addItem when shopping bag icon is clicked', async () => {
        const mockAddItem = jest.fn()
            ; (useCartStore as unknown as jest.Mock).mockReturnValue({
                addItem: mockAddItem
            })

        render(<CatalogPage />)
        await waitFor(() => {
            const addToCartBtn = screen.getByTestId(`add-to-cart-${mockProducts[0].id}`)
            fireEvent.click(addToCartBtn)
            expect(mockAddItem).toHaveBeenCalledWith(mockProducts[0])
        })
    })

    it('displays no products message when empty', async () => {
        const { createClient } = require('@/utils/supabase/client')
            ; (createClient as jest.Mock).mockImplementation(() => ({
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
