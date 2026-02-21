import { Card, CardContent } from "@/components/ui/card"
import { createClerkSupabaseClient } from "@/utils/supabase/server"
import { OrderRegistry } from "./components/OrderRegistry"

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            profiles (
                email
            ),
            order_items (
                quantity,
                price,
                products (
                    name
                )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Failed to fetch orders:', error)
    }

    const processedOrders = (orders || []).map((order: any) => {
        const items = order.order_items || []
        const productNames = items
            .map((item: any) => item.products?.name || (item.price ? `Product ($${item.price})` : null))
            .filter(Boolean)

        let displayProduct = 'No Items Found'
        if (productNames.length > 0) {
            displayProduct = productNames[0]
            if (productNames.length > 1) {
                displayProduct += ` + ${productNames.length - 1} more`
            }
        }

        return {
            ...order,
            productName: displayProduct
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Order Stream</h1>
                <p className="text-slate-500 font-medium tracking-tight">Real-time log of all customer transactions.</p>
            </div>

            <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-4 md:p-8 border border-white/40">
                <CardContent className="px-0 pt-4">
                    <OrderRegistry initialOrders={processedOrders} />
                </CardContent>
            </Card>
        </div>
    )
}
