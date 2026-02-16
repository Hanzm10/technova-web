
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Component', () => {
    it('renders all card subcomponents correctly', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>Card Content</CardContent>
                <CardFooter>Card Footer</CardFooter>
            </Card>
        )
        expect(screen.getByText('Card Title')).toBeInTheDocument()
        expect(screen.getByText('Card Description')).toBeInTheDocument()
        expect(screen.getByText('Card Content')).toBeInTheDocument()
        expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })

    it('applies brand-specific glassmorphism and rounded corners', () => {
        const { container } = render(<Card>Glass Card</Card>)
        const cardElement = container.firstChild as HTMLElement
        // Expecting backdrop-blur-md and rounded-lg (3rem)
        expect(cardElement).toHaveClass('backdrop-blur-md')
        expect(cardElement).toHaveClass('rounded-lg')
    })
})
