
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('bg-primary')
    })

    it('applies the brand-specific rounded corners', () => {
        render(<Button>Brand Button</Button>)
        const button = screen.getByRole('button', { name: /brand button/i })
        // We want to ensure it has the rounded-lg class or equivalent that maps to 3rem
        // In our case, we are going to update the component to use rounded-lg or rounded-[3rem]
        expect(button).toHaveClass('rounded-lg')
    })
})
