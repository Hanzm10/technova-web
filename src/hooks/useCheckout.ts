import { useState } from 'react'
import { createOrder } from '@/app/actions/order'
import { useRouter } from 'next/navigation'
import { useRevenueCat } from '@/components/providers/RevenueCatProvider'
import { useCartStore } from '@/hooks/useCartStore'
import { Package, ErrorCode } from '@revenuecat/purchases-js'
import { useToastStore } from '@/hooks/useToastStore'
import { useUser, useClerk } from '@clerk/nextjs'

/**
 * Hook to handle the checkout process via RevenueCat.
 */
export function useCheckout() {
    const { purchases, offerings, isReady } = useRevenueCat()
    const { items, clearCart } = useCartStore()
    const { addToast } = useToastStore()
    const { isSignedIn } = useUser()
    const { openSignIn } = useClerk()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleCheckout = async () => {
        if (!isSignedIn) {
            addToast('Please sign in to complete your checkout', 'info')
            openSignIn()
            return
        }

        if (!isReady || !purchases || items.length === 0) {
            const msg = 'Checkout not ready or cart is empty'
            setError(msg)
            addToast(msg, 'error')
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
            // RevenueCat Web Billing identifiers do not support hyphens, so we check for
            // sanitized versions (underscores) as well.
            const sanitizedId = firstItem.id.replace(/-/g, '_')

            const pkg = offering.availablePackages.find(
                (p: Package) =>
                    (p.rcBillingProduct?.identifier === firstItem.id) ||
                    (p.identifier === firstItem.id) ||
                    (p.rcBillingProduct?.identifier === sanitizedId) ||
                    (p.identifier === sanitizedId)
            )

            if (!pkg) {
                // If we can't find a matching product, throw an error instead of falling back to a default subscription.
                console.warn(`Product not found in RevenueCat offering. Expected identifier: ${firstItem.id} OR ${sanitizedId}`)
                throw new Error(`Product '${firstItem.name}' (ID: ${firstItem.id}) not configured in RevenueCat. Please add it to your offering with identifier: ${sanitizedId}`)
            }

            console.log('Initiating purchase for:', pkg.rcBillingProduct?.identifier || pkg.identifier)

            await purchases.purchasePackage(pkg)

            console.log('Purchase successful/valid:', pkg.rcBillingProduct?.identifier || pkg.identifier)

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
                    addToast('Order placed successfully!', 'success')
                    // Delay navigation slightly to ensure all scripts clean up
                    setTimeout(() => {
                        router.push('/checkout/success')
                    }, 500)
                } else {
                    throw new Error('Failed to record order')
                }
            } catch (orderError: any) {
                console.error('Order recording failed:', orderError)
                const errorMsg = 'Purchase successful, but failed to record order. Please contact support.'
                setError(errorMsg)
                addToast(errorMsg, 'error')
                // Ideally trigger a manual retry or support alert here
            }

        } catch (e: any) {
            if (e.code === ErrorCode.UserCancelledError) {
                // User cancelled the purchase
                console.log('User cancelled checkout')
                addToast('Checkout cancelled', 'info')
                // We don't need to show an error to the user
            } else {
                console.error('Checkout error:', e)
                const errorMsg = e.message || 'An error occurred during checkout'
                setError(errorMsg)
                addToast(errorMsg, 'error')
            }
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
