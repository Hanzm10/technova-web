import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium truncate max-w-[100px]">{order.id}</TableCell>
                                <TableCell className="truncate max-w-[100px]">{order.user_id}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell className="text-right">
                                    ${order.total_price.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
