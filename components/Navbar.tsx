import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#E8ECEF]/80 backdrop-blur-md py-4 border-b border-white/20' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#shop" className="hover:text-slate-900 transition-colors">SHOP</a>
          <a href="#electronics" className="hover:text-slate-900 transition-colors">ELECTRONICS</a>
          <a href="#fashion" className="hover:text-slate-900 transition-colors">FASHION</a>
          <a href="#home" className="hover:text-slate-900 transition-colors">HOME</a>
        </div>

        {/* Logo */}
        <div className="text-2xl font-bold tracking-tighter text-slate-900 flex-shrink-0">
          TECHNOVA
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 mr-4">
             <a href="#search" className="hover:text-slate-900 transition-colors"><Search size={18} /></a>
             <a href="#seasonal" className="hover:text-slate-900 transition-colors">SEASONAL</a>
          </div>
          
          <Button variant="primary" size="sm" className="hidden md:flex">
            SIGN IN / UP
          </Button>
          
          <button className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors">
            <ShoppingBag size={18} />
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
          <a href="#shop" className="text-lg font-medium text-slate-900">SHOP</a>
          <a href="#electronics" className="text-lg font-medium text-slate-900">ELECTRONICS</a>
          <a href="#fashion" className="text-lg font-medium text-slate-900">FASHION</a>
          <a href="#home" className="text-lg font-medium text-slate-900">HOME</a>
          <div className="pt-4 border-t border-gray-200">
            <Button variant="primary" className="w-full">SIGN IN</Button>
          </div>
        </div>
      )}
    </nav>
  );
};