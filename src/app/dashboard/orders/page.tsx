import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DashboardMobileCard, DashboardMobileCardItem } from "@/components/dashboard/DashboardMobileCard"
import { createClerkSupabaseClient } from "@/utils/supabase/server"
import { OrderStatusSelect } from "./components/OrderStatusSelect"
import { OrderTable } from "./components/OrderTable"
import { Package2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const supabase = await createClerkSupabaseClient()
    const { data: orders } = await supabase
        .from('orders')
        .select(`
            *,
            profiles (
                email
            ),
            order_items (
                quantity,
                products (
                    name
                )
            )
        `)
        .order('created_at', { ascending: false })

    const processedOrders = (orders || []).map((order: any) => {
        const items = order.order_items || []
        const productNames = items.map((item: any) => item.products?.name).filter(Boolean)

        let displayProduct = 'Sample Product'
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
                <CardHeader className="px-2 pb-8">
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Transaction Registry</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Review and manage recent purchase orders.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <OrderTable orders={processedOrders} />
                        {processedOrders.length === 0 && (
                            <div className="h-32 flex items-center justify-center text-slate-400 font-medium italic">
                                No orders found.
                            </div>
                        )}
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4 px-2">
                        {processedOrders.map((order: any) => (
                            <DashboardMobileCard
                                key={order.id}
                                title={order.productName}
                                subtitle={`Order #${order.id.slice(0, 8)}`}
                                status={
                                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                                }
                            >
                                <div className="col-span-2 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <DashboardMobileCardItem label="Total Price" value={`$${order.total_price.toFixed(2)}`} />
                                        <DashboardMobileCardItem label="Date" value={new Date(order.created_at).toLocaleDateString()} />
                                    </div>

                                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-inner">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                                            <Package2 className="h-3 w-3" />
                                            Order Items
                                        </div>
                                        <div className="space-y-3">
                                            {order.order_items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-400">{item.quantity}x</span>
                                                        <span className="text-xs font-bold text-slate-700">{item.products?.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-4">
                                        <DashboardMobileCardItem label="Order ID" value={order.id} />
                                        <DashboardMobileCardItem label="Customer" value={order.profiles?.email || 'Guest'} />
                                    </div>
                                </div>
                            </DashboardMobileCard>
                        ))}
                        {processedOrders.length === 0 && (
                            <div className="py-20 text-center text-slate-400 font-medium italic">
                                No orders found.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
