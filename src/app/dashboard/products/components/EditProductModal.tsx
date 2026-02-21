'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Package, Tag, DollarSign, Image as ImageIcon, Pencil, Loader2 } from "lucide-react"
import { updateProduct } from '@/app/actions/product'

type Product = {
    id: string
    name: string
    category: string
    price: number
    image: string
}

export function EditProductModal({ product }: { product: Product }) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        formData.append('id', product.id)

        try {
            const res = await updateProduct(formData)
            if (res.error) {
                alert(res.error)
            } else {
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            alert('Failed to update product')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 text-slate-500 hover:text-slate-900">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Edit Product</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium tracking-tight">
                        Update the details for this item.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-slate-500">Product Name</Label>
                        <div className="relative">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input id="name" name="name" defaultValue={product.name} disabled className="pl-12 h-14 bg-slate-100/50 border-slate-200/60 rounded-2xl text-slate-500 cursor-not-allowed font-medium transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label htmlFor="category" className="text-xs font-black uppercase tracking-wider text-slate-500">Category</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Select name="category" defaultValue={product.category} required>
                                    <SelectTrigger id="category" className="w-full pl-10 h-14 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all font-medium text-sm">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-1">
                                        <SelectItem value="Home" className="rounded-xl cursor-pointer focus:bg-slate-100 focus:text-slate-900 py-3">Home</SelectItem>
                                        <SelectItem value="Gadgets" className="rounded-xl cursor-pointer focus:bg-slate-100 focus:text-slate-900 py-3">Gadgets</SelectItem>
                                        <SelectItem value="Fashion" className="rounded-xl cursor-pointer focus:bg-slate-100 focus:text-slate-900 py-3">Fashion</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="price" className="text-xs font-black uppercase tracking-wider text-slate-500">Price (USD)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required className="pl-10 h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl text-slate-900 font-medium focus-visible:ring-slate-900 focus-visible:border-transparent transition-all text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="image" className="text-xs font-black uppercase tracking-wider text-slate-500">New Image (Optional)</Label>
                        <div className="relative">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input id="image" name="image" type="file" accept="image/*" className="pl-12 pt-3 h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl text-slate-900 file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-12 px-6 font-bold shadow-xl shadow-slate-900/10">
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
