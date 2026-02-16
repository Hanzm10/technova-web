import { useState } from 'react'
import { createOrder } from '@/app/actions/order'
import { useRouter } from 'next/navigation'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { useCartStore } from '@/hooks/useCartStore'
import { Package } from '@revenuecat/purchases-js'

/**
 * Hook to handle the checkout process via RevenueCat.
 */
export function useCheckout() {
    const { purchases, offerings, isReady } = useRevenueCat()
    const { items, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleCheckout = async () => {
        if (!isReady || !purchases || items.length === 0) {
            setError('Checkout not ready or cart is empty')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // For a standard e-commerce store using RevenueCat Web Billing,
            // we typically map our products to RevenueCat Packages.
            // In this implementation, we'll try to purchase the first item in the cart
            // as a demonstration of the RevenueCat purchase flow.

            const firstItem = items[0]

            if (!offerings || !offerings.all) {
                throw new Error('No offerings found')
            }

            // Find an offering that matches the product name or id
            // This is a simplified mapping for the demo

            const offering = offerings.current || Object.values(offerings.all)[0]
            const pkg = offering.availablePackages.find(
                (p: Package) => (p.rcBillingProduct?.identifier === firstItem.id) || (p.identifier === firstItem.id)
            ) || offering.availablePackages[0]

            if (!pkg) {
                throw new Error('Product not found in RevenueCat offerings')
            }

            console.log('Initiating purchase for:', pkg.rcBillingProduct?.identifier || pkg.identifier)

            await purchases.purchasePackage(pkg)

            // Purchase successful in RevenueCat
            // Now record the order in our database
            try {
                const result = await createOrder({
                    items: items.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalPrice: items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
                })

                if (result.success) {
                    clearCart()
                    router.push('/checkout/success')
                } else {
                    throw new Error('Failed to record order')
                }
            } catch (orderError: any) {
                console.error('Order recording failed:', orderError)
                setError('Purchase successful, but failed to record order. Please contact support.')
                // Ideally trigger a manual retry or support alert here
            }

        } catch (e: any) {
            console.error('Checkout error:', e)
            setError(e.message || 'An error occurred during checkout')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        handleCheckout,
        isLoading,
        error
    }
}
