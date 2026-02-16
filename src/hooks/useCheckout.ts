import { useState } from 'react'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { useCartStore } from '@/hooks/useCartStore'

/**
 * Hook to handle the checkout process via RevenueCat.
 */
export function useCheckout() {
    const { purchases, offerings, isReady } = useRevenueCat()
    const { items, clearCart } = useCartStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
                (p: any) => (p.rcBillingProduct?.identifier === firstItem.id) || (p.identifier === firstItem.id)
            ) || offering.availablePackages[0]

            if (!pkg) {
                throw new Error('Product not found in RevenueCat offerings')
            }

            console.log('Initiating purchase for:', pkg.rcBillingProduct?.identifier || pkg.identifier)

            // @ts-ignore
            await purchases.purchasePackage(pkg)

            // Success! (In a real app, successful purchase would redirect via Stripe)
            // If we get back here, the purchase flow finished.
            clearCart()

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
