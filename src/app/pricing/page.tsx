'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { LegacyButton } from '@/components/ui/legacy-button'
import { motion } from 'framer-motion'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'

const tiers = [
    {
        name: 'Fashionista',
        price: 'Free',
        description: 'Perfect for casual browsers and style seekers.',
        features: [
            'Access to standard catalog',
            'Community wishlist',
            'Standard shipping',
            'Weekly newsletter'
        ],
        cta: 'Get Started',
        highlighted: false
    },
    {
        name: 'Tech Guru',
        price: '$9.99/mo',
        description: 'For those who stay ahead of the technology curve.',
        features: [
            'All Fashionista features',
            'Early access to gadget drops',
            'Exclusive tech reviews',
            '5% discount on electronics'
        ],
        cta: 'Go Pro',
        highlighted: true
    },
    {
        name: 'Lifestyle Icon',
        price: '$19.99/mo',
        description: 'The ultimate TechNova experience for modern living.',
        features: [
            'All Tech Guru features',
            'Free express shipping',
            'Personal style consultant',
            'Invite-only product launches',
            'VIP Customer support'
        ],
        cta: 'Join Now',
        highlighted: false
    }
]

export default function PricingPage() {
    const { offerings, isReady } = useRevenueCat()

    // In a real implementation, we would map offerings from RevenueCat
    // Here we use the hardcoded tiers for UI demonstration

    return (
        <div className="bg-[#E8ECEF] min-h-screen pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 block"
                >
                    Choose Your Experience
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-6"
                >
                    Tiers of Innovation
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-600 max-w-2xl mx-auto text-lg"
                >
                    Unlock exclusive benefits and elevate your lifestyle with TechNova memberships.
                </motion.p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, index) => (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`relative p-8 rounded-[3rem] ${tier.highlighted
                            ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10'
                            : 'bg-white text-slate-900 border border-slate-200'
                            }`}
                    >
                        {tier.highlighted && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/20 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                                Most Popular
                            </span>
                        )}
                        <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">{tier.price}</span>
                        </div>
                        <p className={`mb-8 text-sm ${tier.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                            {tier.description}
                        </p>
                        <ul className="space-y-4 mb-10">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <Check className={`mr-3 h-5 w-5 mt-0.5 ${tier.highlighted ? 'text-white' : 'text-slate-900'}`} />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <LegacyButton
                            variant={tier.highlighted ? 'primary' : 'secondary'}
                            className="w-full rounded-2xl py-6 font-bold"
                        >
                            {tier.cta}
                        </LegacyButton>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
