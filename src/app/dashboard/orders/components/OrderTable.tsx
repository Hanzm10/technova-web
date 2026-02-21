'use client'

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, Package2, Copy, Check } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import { OrderStatusSelect } from "./OrderStatusSelect"

interface Order {
    id: string
    status: string
    total_price: number
    created_at: string
    profile_id: string
    productName: string
    order_items: Array<{
        quantity: number
        price: number
        products: {
            name: string
        }
    }>
}

export function OrderTable({ orders }: { orders: any[] }) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleCopy = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        navigator.clipboard.writeText(id)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100/50">
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Order ID</TableHead>
                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Product</TableHead>
                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Total</TableHead>
                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => {
                    const isExpanded = !!expandedRows[order.id]
                    const hasMultiple = order.order_items.length > 1
                    const isCopied = copiedId === order.id

                    return (
                        <Fragment key={order.id}>
                            <TableRow
                                key={order.id}
                                className={cn(
                                    "hover:bg-slate-50/50 border-slate-50/50 transition-colors cursor-pointer group",
                                    isExpanded && "bg-slate-50/80"
                                )}
                                onClick={() => toggleRow(order.id)}
                            >
                                <TableCell className="w-10 px-4">
                                    <div className={cn(
                                        "p-1.5 rounded-lg transition-all duration-300",
                                        isExpanded ? "bg-slate-900 text-white" : "text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100"
                                    )}>
                                        <ChevronDown className={cn(
                                            "h-4 w-4 transition-transform duration-300",
                                            isExpanded && "rotate-180"
                                        )} />
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs font-bold text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <span>{order.id.slice(0, 8)}...</span>
                                        <button
                                            onClick={(e) => handleCopy(e, order.id)}
                                            className={cn(
                                                "p-1 rounded-md transition-all duration-200",
                                                isCopied ? "bg-emerald-50 text-emerald-600" : "opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400"
                                            )}
                                        >
                                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">
                                    <div className="flex flex-col">
                                        <span>{order.productName}</span>
                                        {hasMultiple && !isExpanded && (
                                            <span className="text-[10px] text-slate-400 font-medium">Click to see all items</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                                </TableCell>
                                <TableCell className="text-right font-black text-slate-900">
                                    ${order.total_price.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right text-slate-500 font-medium whitespace-nowrap text-[10px] font-mono">
                                    {formatDateTime(order.created_at)}
                                </TableCell>
                            </TableRow>

                            <AnimatePresence>
                                {isExpanded && (
                                    <TableRow key={`${order.id}-expanded`} className="hover:bg-transparent border-none">
                                        <TableCell colSpan={6} className="p-0">
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-14 pb-6 pt-2">
                                                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-3 shadow-inner">
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 pb-2 border-bottom border-slate-100">
                                                            <Package2 className="h-3 w-3" />
                                                            Order Manifest
                                                        </div>
                                                        <div className="divide-y divide-slate-100">
                                                            {order.order_items.map((item: any, idx: number) => (
                                                                <div key={idx} className="py-2.5 flex items-center justify-between group/item">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-900">
                                                                            {item.quantity}x
                                                                        </div>
                                                                        <span className="text-sm font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors">
                                                                            {item.products?.name || `Product ($${item.price})`}
                                                                        </span>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black bg-white border-slate-100 text-slate-400">
                                                                        Verified Item
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </AnimatePresence>
                        </Fragment>
                    )
                })}
            </TableBody>
        </Table>
    )
}
