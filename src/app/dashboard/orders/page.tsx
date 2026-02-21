import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'
export const dynamic = 'force-dynamic'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardMobileCard, DashboardMobileCardItem } from "@/components/dashboard/DashboardMobileCard"
import { createClerkSupabaseClient } from "@/utils/supabase/server"
import { OrderStatusSelect } from "./components/OrderStatusSelect"

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

    const displayOrders = (orders || []).map((order: any) => {
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
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100/50">
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Order ID</TableHead>
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Product</TableHead>
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Status</TableHead>
                                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Total</TableHead>
                                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayOrders.map((order: any) => (
                                    <TableRow key={order.id} className="hover:bg-slate-50/50 border-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-bold text-slate-400">{order.id.slice(0, 8)}...</TableCell>
                                        <TableCell className="font-bold text-slate-900">{order.productName}</TableCell>
                                        <TableCell>
                                            <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                                        </TableCell>
                                        <TableCell className="text-right font-black text-slate-900">
                                            ${order.total_price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-500 font-medium">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {displayOrders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium italic">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4 px-2">
                        {displayOrders.map((order: any) => (
                            <DashboardMobileCard
                                key={order.id}
                                title={order.productName}
                                subtitle={`Order #${order.id.slice(0, 8)}`}
                                status={
                                    <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                                }
                            >
                                <DashboardMobileCardItem label="Total Price" value={`$${order.total_price.toFixed(2)}`} />
                                <DashboardMobileCardItem label="Date" value={new Date(order.created_at).toLocaleDateString()} />
                                <DashboardMobileCardItem label="Full ID" value={order.id} />
                                <DashboardMobileCardItem label="User ID" value={order.user_id} />
                            </DashboardMobileCard>
                        ))}
                        {displayOrders.length === 0 && (
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
