'use client'

import { useState, useTransition } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from '@/app/actions/orders'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'shipped', label: 'Shipped', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'delivered', label: 'Delivered', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-700 border-rose-200' },
]

export function OrderStatusSelect({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
    const [status, setStatus] = useState(initialStatus)
    const [isPending, startTransition] = useTransition()

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus)
        startTransition(async () => {
            const result = await updateOrderStatus(orderId, newStatus)
            if (result.error) {
                alert(result.error)
                setStatus(initialStatus)
            }
        })
    }

    const currentOption = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0]

    return (
        <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
                <SelectTrigger className={cn(
                    "w-[130px] h-9 rounded-full border-none font-bold text-[10px] uppercase tracking-wider px-3 shadow-sm transition-all",
                    currentOption.color
                )}>
                    {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : null}
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-1">
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="rounded-xl cursor-pointer focus:bg-slate-50 py-2 text-[10px] font-bold uppercase tracking-wider"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
