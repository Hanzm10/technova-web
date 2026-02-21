'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/hooks/useCartStore'
import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/useCheckout'
import { useUser } from '@clerk/nextjs'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { user } = useUser()
    const { items, totalPrice, updateQuantity, removeItem } = useCartStore()
    const { handleCheckout, isLoading, error } = useCheckout()

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl border-l border-slate-100 flex flex-col rounded-l-[3rem] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 flex justify-between items-center border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shopping Bag</h2>
                                <p className="text-slate-500 text-sm">
                                    {items.reduce((acc, item) => acc + item.quantity, 0)}/20 items selected
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBag size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Your bag is empty</h3>
                                    <p className="text-slate-500 max-w-[200px]">Looks like you haven't added anything yet.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 relative">
                                            <Image
                                                fill
                                                src={item.image}
                                                alt={item.name}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{item.category}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id, user?.id)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, user?.id)}
                                                        className="text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, user?.id)}
                                                        className="text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="font-serif italic text-slate-900">
                                                    USD {(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-white border-t border-slate-100 space-y-6">
                                <div className="flex justify-between items-center text-xs uppercase tracking-widest text-slate-400 font-bold">
                                    <span>Total Quantity Limit</span>
                                    <span>{items.reduce((acc, item) => acc + item.quantity, 0)} / 20</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Subtotal</span>
                                    <span className="text-2xl font-bold text-slate-900">
                                        USD {totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'PROCESSING...' : 'CHECKOUT'}
                                    {!isLoading && (
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            →
                                        </motion.span>
                                    )}
                                </Button>
                                {error && (
                                    <p className="text-xs text-red-500 text-center mt-2 font-medium">
                                        {error}
                                    </p>
                                )}
                                <p className="text-[10px] text-center text-slate-400 uppercase tracking-[0.2em]">
                                    Secure checkout via RevenueCat
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
