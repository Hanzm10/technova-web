'use client'

import { useState, useMemo } from 'react'
import { Search, Package2, Copy, Check } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { OrderTable } from "./OrderTable"
import { DashboardMobileCard, DashboardMobileCardItem } from "@/components/dashboard/DashboardMobileCard"
import { OrderStatusSelect } from "./OrderStatusSelect"
import { formatDateTime, cn } from "@/lib/utils"

export function OrderRegistry({ initialOrders }: { initialOrders: any[] }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return initialOrders
        const lowerQuery = searchQuery.toLowerCase()
        return initialOrders.filter(order =>
            order.id.toLowerCase().includes(lowerQuery) ||
            order.productName.toLowerCase().includes(lowerQuery) ||
            order.profiles?.email?.toLowerCase().includes(lowerQuery)
        )
    }, [initialOrders, searchQuery])

    const handleCopy = (e: React.MouseEvent | undefined, id: string) => {
        e?.stopPropagation()
        navigator.clipboard.writeText(id)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Registry Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2 pb-6 border-b border-slate-100/50">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Transaction Registry</h2>
                    <p className="text-slate-500 font-medium text-sm">Review and manage recent purchase orders.</p>
                </div>
                <div className="relative group w-full sm:max-w-xs md:max-w-sm">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                    <Input
                        placeholder="Search ID, Product, Customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 pr-4 py-6 bg-white/50 backdrop-blur-xl border-slate-100 rounded-2xl shadow-inner focus-visible:ring-slate-900 transition-all font-medium text-xs"
                    />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <OrderTable orders={filteredOrders} />
                {filteredOrders.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-slate-400 font-medium italic">
                        No transactions match your search.
                    </div>
                )}
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4 px-2">
                {filteredOrders.map((order: any) => {
                    const isCopied = copiedId === order.id
                    return (
                        <DashboardMobileCard
                            key={order.id}
                            title={order.productName}
                            subtitle={`Order #${order.id.slice(0, 8)}`}
                            status={
                                <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                            }
                        >
                            <div className="col-span-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <DashboardMobileCardItem label="Total Price" value={`$${order.total_price.toFixed(2)}`} />
                                    <DashboardMobileCardItem label="Date" value={formatDateTime(order.created_at)} />
                                </div>

                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-inner">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                                        <Package2 className="h-3 w-3" />
                                        Order Items
                                    </div>
                                    <div className="space-y-3">
                                        {order.order_items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-slate-400">{item.quantity}x</span>
                                                    <span className="text-xs font-bold text-slate-700">{item.products?.name || `Product ($${item.price})`}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-4">
                                    <DashboardMobileCardItem
                                        label="Order ID"
                                        value={
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px]">{order.id}</span>
                                                <button
                                                    onClick={(e) => handleCopy(e, order.id)}
                                                    className={cn(
                                                        "p-1 rounded-md transition-all duration-200",
                                                        isCopied ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                    )}
                                                >
                                                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                </button>
                                            </div>
                                        }
                                    />
                                    <DashboardMobileCardItem label="Customer" value={order.profiles?.email || 'Guest'} />
                                </div>
                            </div>
                        </DashboardMobileCard>
                    )
                })}
                {filteredOrders.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-medium italic">
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    )
}
