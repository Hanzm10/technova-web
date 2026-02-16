'use client'

import Link from 'next/link'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { ShoppingCart } from 'lucide-react'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { Button } from '@/components/ui/button' // Will use shadcn button if created, else fallback to standard button temporarily if import fails? No, better use standard if unsure.

// Fallback Button if Shadcn failed (for TDD speed, refactor later)
function FallbackButton({ children, className, ...props }: any) {
    return <button className={className} {...props}>{children}</button>
}

export function Navbar() {
    const { isSignedIn } = useUser()
    // const { customerInfo } = useRevenueCat() // Not used in display logic yet, but good for future

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center pl-4 pr-4">
                {/* Logo */}
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-xl">TechNova</span>
                    </Link>
                    {/* Desktop Nav */}
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/catalog" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Catalog
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            About
                        </Link>
                    </nav>
                </div>

                {/* Mobile Menu Trigger & Right Actions */}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <nav className="flex items-center space-x-4">
                        {isSignedIn ? (
                            <>
                                <Link href="/cart">
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span className="sr-only">Cart</span>
                                    </Button>
                                </Link>
                                <UserButton />
                            </>
                        ) : (
                            <SignInButton mode="modal">
                                <Button variant="default" size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}
