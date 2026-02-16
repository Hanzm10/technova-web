'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Purchases, CustomerInfo, Offerings } from '@revenuecat/purchases-js'
import { useUser } from '@clerk/nextjs'

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
    const { user, isLoaded: isAuthLoaded } = useUser()
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
    const [offerings, setOfferings] = useState<Offerings | null>(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (!isAuthLoaded) return

        let purchases: any = null

        const init = async () => {
            const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY

            if (!apiKey) {
                console.warn('RevenueCat API Key not found')
                return
            }

            const appUserId = user?.id || 'anonymous'

            try {
                // @ts-ignore
                purchases = Purchases.configure({
                    apiKey,
                    appUserId
                })

                // @ts-ignore
                const [info, offeringsData] = await Promise.all([
                    purchases.getCustomerInfo(),
                    purchases.getOfferings()
                ])

                setCustomerInfo(info)
                setOfferings(offeringsData)
                setIsReady(true)

                // Add listener
                // @ts-ignore
                if (purchases.addCustomerInfoUpdateListener) {
                    // @ts-ignore
                    purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
                        setCustomerInfo(info)
                    })
                }

            } catch (e) {
                console.error("RevenueCat initialization error:", e)
            }
        }

        init()

        return () => {
            try {
                // @ts-ignore
                if (purchases && purchases.removeCustomerInfoUpdateListener) {
                    // @ts-ignore
                    purchases.removeCustomerInfoUpdateListener()
                }
            } catch (e) { }
        }
    }, [user?.id, isAuthLoaded])

    return (
        <RevenueCatContext.Provider value={{ customerInfo, offerings, isReady }}>
            {children}
        </RevenueCatContext.Provider>
    )
}

export const useRevenueCat = () => useContext(RevenueCatContext)
