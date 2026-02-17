'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isOpen) return;

        const fetchProducts = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (data) {
                setProducts(data);
            }
            setLoading(false);
        };

        if (products.length === 0) {
            fetchProducts();
        }
    }, [isOpen, products.length]);

    // Handle close on Escape
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', down);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', down);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm transition-all duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 transform transition-all duration-200 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <Command className="w-full" loop shouldFilter={true}>
                    <div className="flex items-center border-b px-4 py-3" cmdk-input-wrapper="">
                        <Search className="mr-3 h-5 w-5 shrink-0 opacity-50 text-slate-500" />
                        <Command.Input
                            placeholder="Search products..."
                            className="flex h-6 w-full rounded-md bg-transparent text-lg outline-none placeholder:text-slate-400 text-slate-900"
                            autoFocus
                        />
                    </div>
                    <Command.List className="max-h-[60vh] overflow-y-auto overflow-x-hidden p-2">
                        {loading && (
                            <div className="py-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin mb-2 text-slate-400" />
                                <span className="text-slate-400">Loading products...</span>
                            </div>
                        )}

                        {!loading && products.length > 0 && (
                            <Command.Empty className="py-12 text-center text-lg text-slate-500">
                                No products found.
                            </Command.Empty>
                        )}

                        <Command.Group heading="Products" className="px-2">
                            {products.map((product) => (
                                <Command.Item
                                    key={product.id}
                                    value={product.name} // Important for filtering
                                    onSelect={() => {
                                        router.push(`/catalog/${product.id}`);
                                        onClose();
                                    }}
                                    className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-3 text-sm outline-none data-[selected='true']:bg-slate-100 data-[selected='true']:text-slate-900 transition-colors"
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        {product.image && (
                                            <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col flex-grow">
                                            <span className="font-medium text-slate-900 text-base">{product.name}</span>
                                            <span className="text-xs text-slate-500 capitalize">{product.category}</span>
                                        </div>
                                        <span className="ml-auto font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded text-xs tabular-nums">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                    </div>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    </Command.List>

                    <div className="border-t bg-slate-50 px-4 py-2.5 text-xs text-slate-500 flex items-center justify-end gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 border-slate-200">↵</kbd>
                            <span>to select</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 border-slate-200">Esc</kbd>
                            <span>to close</span>
                        </span>
                    </div>
                </Command>
            </div>
        </div>
    );
};
