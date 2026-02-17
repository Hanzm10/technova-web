'use client'

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/hooks/useCartStore';
import { CartDrawer } from '@/components/catalog/CartDrawer';
import { MobileMenu } from './MobileMenu';
import { SearchModal } from '@/components/search/SearchModal';
import { cn } from '@/lib/utils';

const NavLink = ({ href, label, currentPath, searchParam }: { href: string, label: string, currentPath: string, searchParam?: string }) => {
    const searchParams = useSearchParams();
    const isActive = searchParam
        ? currentPath === '/catalog' && searchParams.toString().includes(searchParam)
        : currentPath === href;

    return (
        <Link
            href={href}
            className={cn(
                "transition-all duration-300 ease-in-out hover:text-slate-900 hover:scale-105",
                isActive ? "text-slate-900 font-bold" : "text-slate-600"
            )}
        >
            {label}
        </Link>
    );
};

interface NavbarProps {
    isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { isSignedIn } = useUser();
    const { items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-[#E8ECEF]/80 backdrop-blur-md py-4 border-b border-white/20'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-8xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900 flex-shrink-0">
                        TECHNOVA
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 mr-4">
                            <NavLink href="/catalog" label="SHOP" currentPath={pathname} />
                            <NavLink href="/favorites" label="FAVORITES" currentPath={pathname} />
                            {isAdmin && (
                                <Link
                                    href="/dashboard"
                                    className="transition-all duration-300 ease-in-out hover:text-slate-900 hover:scale-105 text-primary font-semibold"
                                >
                                    DASHBOARD
                                </Link>
                            )}
                            <button onClick={() => setIsSearchOpen(true)} className="hover:text-slate-900 transition-colors"><Search size={18} /></button>
                        </div>

                        {isSignedIn ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <SignInButton mode="modal">
                                <Button size="sm" className="hidden md:flex rounded-full">
                                    SIGN IN / UP
                                </Button>
                            </SignInButton>
                        )}

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors relative"
                        >
                            <ShoppingBag size={18} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-slate-900">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden p-2 text-slate-900"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                    isAdmin={isAdmin}
                    isSignedIn={isSignedIn}
                />
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};
