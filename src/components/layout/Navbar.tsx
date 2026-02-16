'use client'

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { LegacyButton } from '@/components/ui/legacy-button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCartStore';
import { CartDrawer } from '@/components/catalog/CartDrawer';

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { isSignedIn } = useUser();
    const { items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-[#E8ECEF]/80 backdrop-blur-md py-4 border-b border-white/20'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Left Links */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                        <Link href="/catalog" className="hover:text-slate-900 transition-colors">SHOP</Link>
                        <Link href="/catalog?category=electronics" className="hover:text-slate-900 transition-colors">ELECTRONICS</Link>
                        <Link href="/catalog?category=fashion" className="hover:text-slate-900 transition-colors">FASHION</Link>
                        <Link href="/catalog?category=home" className="hover:text-slate-900 transition-colors">HOME</Link>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900 flex-shrink-0">
                        TECHNOVA
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 mr-4">
                            <button className="hover:text-slate-900 transition-colors"><Search size={18} /></button>
                            <Link href="#seasonal" className="hover:text-slate-900 transition-colors">SEASONAL</Link>
                        </div>

                        {isSignedIn ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <SignInButton mode="modal">
                                <LegacyButton variant="primary" size="sm" className="hidden md:flex">
                                    SIGN IN / UP
                                </LegacyButton>
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
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-[#E8ECEF] border-b border-gray-200 p-6 md:hidden flex flex-col space-y-4 shadow-xl">
                        <Link href="/catalog" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
                        <Link href="/catalog?category=electronics" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>ELECTRONICS</Link>
                        <Link href="/catalog?category=fashion" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>FASHION</Link>
                        <Link href="/catalog?category=home" className="text-lg font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
                        <div className="pt-4 border-t border-gray-200">
                            {!isSignedIn && (
                                <SignInButton mode="modal">
                                    <LegacyButton variant="primary" className="w-full">SIGN IN</LegacyButton>
                                </SignInButton>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};
