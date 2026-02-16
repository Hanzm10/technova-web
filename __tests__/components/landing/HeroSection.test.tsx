
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/landing/HeroSection'

describe('HeroSection Component', () => {
    it('renders the main typography INNOVATE', () => {
        render(<HeroSection />)
        expect(screen.getByText(/INNOVATE/i)).toBeInTheDocument()
    })

    it('renders the slogan your LIFESTYLE', () => {
        render(<HeroSection />)
        expect(screen.getByText(/your/i)).toBeInTheDocument()
        expect(screen.getByText(/LIFESTYLE/i)).toBeInTheDocument()
    })

    it('renders the main headline INNOVATE', () => {
        render(<HeroSection />)
        expect(screen.getByText(/INNOVATE/i)).toBeInTheDocument()
    })

    it('renders the Shop Now CTA button', () => {
        render(<HeroSection />)
        const button = screen.getByRole('button', { name: /Shop Now/i })
        expect(button).toBeInTheDocument()
    })
})
