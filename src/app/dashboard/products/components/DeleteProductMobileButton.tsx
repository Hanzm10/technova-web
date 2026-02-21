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

export function DeleteProductMobileButton({ id, hasTransactions }: { id: string, hasTransactions?: boolean }) {
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
                    <div className="flex-1 cursor-not-allowed">
                        <Button
                            variant="outline"
                            disabled
                            className="w-full border-red-100 text-red-600 font-bold opacity-50 pointer-events-none flex justify-center items-center"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                            variant="outline"
                            className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-xl border-none text-white px-3 py-1.5 shadow-2xl shadow-black/20">
                    Delete product
                </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl bg-white/95 backdrop-blur-xl sm:max-w-md w-[90vw] p-6 mx-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Delete Product</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium tracking-tight">
                        Are you sure you want to permanently delete this product? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
                    <AlertDialogCancel className="w-full sm:w-auto rounded-2xl h-12 px-6 font-bold text-slate-600 hover:text-slate-900 border-slate-200 mt-0">Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full sm:w-auto rounded-2xl h-12 px-6 font-bold bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20"
                    >
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
