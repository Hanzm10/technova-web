'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '@/app/actions/product'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function DeleteProductButton({ id, hasTransactions }: { id: string, hasTransactions?: boolean }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const [open, setOpen] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        setIsDeleting(true)
        try {
            const res = await deleteProduct(id)
            if (res.error) {
                alert(res.error)
            } else {
                router.refresh()
            }
        } catch (error) {
            alert('Failed to delete product')
        } finally {
            setIsDeleting(false)
        }
    }

    if (hasTransactions) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="inline-block cursor-not-allowed">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled
                            className="hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors opacity-50 pointer-events-none"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/90 backdrop-blur-md text-[10px] uppercase tracking-widest rounded-xl border-none text-white px-3 py-1.5 shadow-2xl shadow-black/20">
                    Cannot delete product with existing orders
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                            className="hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-xl border-none text-white px-3 py-1.5 shadow-2xl shadow-black/20">
                    Delete product
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl sm:max-w-[425px] p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Delete Product</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium tracking-tight">
                        Are you sure you want to permanently delete this product? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="rounded-2xl h-12 px-6 font-bold text-slate-600 hover:text-slate-900 border-slate-200">Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-2xl h-12 px-6 font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20"
                    >
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
