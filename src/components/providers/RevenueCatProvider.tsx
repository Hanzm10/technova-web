'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Purchases, CustomerInfo, Offerings } from '@revenuecat/purchases-js'

interface RevenueCatContextType {
    customerInfo: CustomerInfo | null
    offerings: Offerings | null
    isReady: boolean
}

const RevenueCatContext = createContext<RevenueCatContextType>({
    customerInfo: null,
    offerings: null,
    isReady: false
})

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
    const [offerings, setOfferings] = useState<Offerings | null>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        let purchases: any = null; // Use any to bypass TS strictness if types are missing

        const init = async () => {
            const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY

            if (!apiKey) {
                console.warn('RevenueCat API Key not found')
                return
            }

            // Configure strictly client-side
            // @ts-ignore - Bypass potential type mismatch for now
            purchases = Purchases.configure({
                apiKey,
                appUserId: 'anonymous'
            })

            try {
                // @ts-ignore
                const info = await purchases.getCustomerInfo()
                setCustomerInfo(info)

                // @ts-ignore
                const offerings = await purchases.getOfferings()
                setOfferings(offerings)


                setIsReady(true)

                // Add listener inside init after verified initialization
                try {
                    // @ts-ignore
                    if (purchases && purchases.addCustomerInfoUpdateListener) {
                        // @ts-ignore
                        purchases.addCustomerInfoUpdateListener((info) => {
                            setCustomerInfo(info)
                        })
                    }
                } catch (e) {
                    console.warn("Listener error", e)
                }

            } catch (e) {
                console.error("RevenueCat initialization error:", e)
            }
        }

        init()

        return () => {
            // Cleanup if needed - purchases might be null if init failed
            try {
                // @ts-ignore
                if (purchases && purchases.removeCustomerInfoUpdateListener) {
                    // @ts-ignore
                    purchases.removeCustomerInfoUpdateListener((info) => { })
                }
            } catch (e) { }
        }
    }, [])

    return (
        <RevenueCatContext.Provider value={{ customerInfo, offerings, isReady }}>
            {children}
        </RevenueCatContext.Provider>
    )
}

export const useRevenueCat = () => useContext(RevenueCatContext)
