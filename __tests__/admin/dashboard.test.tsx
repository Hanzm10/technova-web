import { render, screen } from '@testing-library/react'
import AdminLayout from '@/app/dashboard/layout'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/utils/supabase/server'

// Mock Clerk auth
jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn(),
    currentUser: jest.fn(),
}))

// Mock Supabase server utils
jest.mock('@/utils/supabase/server', () => ({
    getUserRole: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
    usePathname: jest.fn(() => '/dashboard'),
}))

// Sidebar might be a server or client component, but let's mock it to avoid complexity
jest.mock('@/components/layout/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar Mock</div>,
}))

describe('Admin Layout', () => {
    it('redirects to home if no user is authenticated', async () => {
        (auth as unknown as jest.Mock).mockReturnValue({ userId: null })
            ; (getUserRole as jest.Mock).mockResolvedValue(null)

        try {
            await AdminLayout({ children: <div>Child</div> })
        } catch (e) { }

        expect(redirect).toHaveBeenCalledWith('/')
    })

    it('redirects to home if user is not an admin', async () => {
        (auth as unknown as jest.Mock).mockReturnValue({ userId: 'user_123' })
            ; (getUserRole as jest.Mock).mockResolvedValue('customer')

        try {
            await AdminLayout({ children: <div>Child</div> })
        } catch (e) { }

        expect(redirect).toHaveBeenCalledWith('/')
    })

    it('renders children and sidebar when authenticated as admin', async () => {
        (auth as unknown as jest.Mock).mockReturnValue({ userId: 'admin_123' })
            ; (getUserRole as jest.Mock).mockResolvedValue('admin')

        const component = await AdminLayout({ children: <div data-testid="child">Child Content</div> })

        render(component)

        expect(screen.getByTestId('sidebar')).toBeInTheDocument()
        expect(screen.getByTestId('child')).toBeInTheDocument()
    })
})
