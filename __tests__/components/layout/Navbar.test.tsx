
import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/layout/Navbar'

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
    UserButton: () => <div data-testid="user-button">User Button</div>,
    SignInButton: () => <div data-testid="sign-in-button">Sign In</div>,
    useUser: () => ({
        isSignedIn: false,
        user: null,
    }),
}))

// Mock RevenueCat hook
jest.mock('@/components/providers/RevenueCatProvider', () => ({
    useRevenueCat: () => ({ customerInfo: null, isReady: true })
}))

describe('Navbar Component', () => {
    it('renders the logo', () => {
        render(<Navbar />)
        expect(screen.getByText('TechNova')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
        render(<Navbar />)
        expect(screen.getByText('Catalog')).toBeInTheDocument()
    })

    it('renders sign in button when logged out', () => {
        render(<Navbar />)
        expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
    })
})
