
import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/layout/Sidebar'

jest.mock('next/navigation', () => ({
    usePathname: () => '/dashboard',
}))

describe('Sidebar Component', () => {
    it('renders navigation links', () => {
        render(<Sidebar />)
        expect(screen.getAllByText(/Dashboard/i)[0]).toBeInTheDocument()
        expect(screen.getByText(/Settings/i)).toBeInTheDocument()
    })

    it('has responsive classes', () => {
        const { container } = render(<Sidebar />)
        const sidebar = container.firstChild
        expect(sidebar).toHaveClass('hidden') // Mobile hidden by default
        expect(sidebar).toHaveClass('md:flex') // Desktop visible
    })
})
