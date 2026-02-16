
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '../../../src/components/ui/input'

describe('Input Component', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Enter text" />)
        const input = screen.getByPlaceholderText('Enter text')
        expect(input).toBeInTheDocument()
    })

    it('applies brand-specific rounded corners', () => {
        render(<Input placeholder="Rounded Input" />)
        const input = screen.getByPlaceholderText('Rounded Input')
        // Expecting rounded-lg (3rem)
        expect(input).toHaveClass('rounded-lg')
    })
})
