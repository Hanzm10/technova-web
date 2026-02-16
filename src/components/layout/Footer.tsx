import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 rounded-t-[3rem] mt-12 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <h3 className="text-3xl font-bold tracking-tighter mb-6">TECHNOVA</h3>
                        <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
                            Redefining the intersection of technology and lifestyle. We curate products that enhance your daily experience through innovation and design.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<Facebook size={20} />} />
                            <SocialIcon icon={<Instagram size={20} />} />
                            <SocialIcon icon={<Twitter size={20} />} />
                            <SocialIcon icon={<Linkedin size={20} />} />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-bold mb-6 text-lg">Shop</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Fashion</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Home Essentials</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Partners</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-6 text-lg">Support</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Warranty</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} TechNova Inc. All rights reserved.</p>
                    <div className="flex space-x-8 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all duration-300">
        {icon}
    </Link>
);
