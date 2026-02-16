
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/Footer'

describe('Footer Component', () => {
    it('renders copyright text', () => {
        render(<Footer />)
        const elements = screen.getAllByText(/TechNova/i)
        expect(elements.length).toBeGreaterThan(0)
        expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
    })

    it('renders legal links', () => {
        render(<Footer />)
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
        expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    })
})
