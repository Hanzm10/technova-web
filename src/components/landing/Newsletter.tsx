'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('email', email);

        const result = await subscribeToNewsletter(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success as string });
            setEmail('');
        }

        setIsLoading(false);
    };

    return (
        <section className="py-24 bg-card rounded-[3rem] mx-4 my-12 shadow-sm border border-border relative overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply filter dark:mix-blend-normal dark:bg-primary/10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl mix-blend-multiply filter dark:mix-blend-normal dark:bg-accent/5" ></div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">Our Newsletter</span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-foreground">STAY AHEAD OF THE CURVE</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                    Subscribe to receive updates, access to exclusive deals, and more. No spam, just tech and style.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-4 sm:gap-0 relative z-10 w-full" aria-label="Newsletter subscription">
                    <label htmlFor="email-input" className="sr-only">Email address</label>
                    <input
                        id="email-input"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-gray-100 px-6 py-4 rounded-full sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-500 w-full"
                        disabled={isLoading}
                        required
                    />
                    <Button
                        type="submit"
                        size="lg"
                        className="rounded-full sm:rounded-l-none h-auto py-4 px-8 font-bold bg-slate-900 text-white hover:bg-slate-800"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'JOIN'}
                    </Button>
                </form>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`}
                        >
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};
