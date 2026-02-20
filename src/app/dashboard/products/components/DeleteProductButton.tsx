'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '@/app/actions/product'
import { useRouter } from 'next/navigation'

export function DeleteProductButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return

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

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
