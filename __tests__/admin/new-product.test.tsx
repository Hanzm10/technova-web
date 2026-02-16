import { render, screen } from '@testing-library/react'
import NewProductPage from '@/app/dashboard/products/new/page'

// Mock server action
jest.mock('@/app/actions/products', () => ({
    addProduct: jest.fn(),
}))

describe('New Product Page', () => {
    it('renders the add product form', () => {
        render(<NewProductPage />)

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/image url/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /save product/i })).toBeInTheDocument()
    })
})
