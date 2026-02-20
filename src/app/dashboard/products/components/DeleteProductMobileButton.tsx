'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '@/app/actions/product'
import { useRouter } from 'next/navigation'

export function DeleteProductMobileButton({ id }: { id: string }) {
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
            variant="outline"
            className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
        </Button>
    )
}
