import { getDashboardStats } from "@/app/actions/analytics"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Monitor your store's performance and manage your business.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    description="Gross sales across all time"
                    icon={DollarSign}
                    trend="neutral"
                />
                <StatsCard
                    title="Active Users"
                    value={stats.userCount}
                    description="Total registered profiles"
                    icon={Users}
                    trend="up"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.orderCount}
                    description="Successfully placed orders"
                    icon={ShoppingCart}
                    trend="neutral"
                />
                <StatsCard
                    title="Avg. Order Value (AOV)"
                    value={`$${stats.aov.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    description="Revenue per transaction"
                    icon={TrendingUp}
                    trend="neutral"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Sales trend over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RevenueChart data={stats.salesTrend} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>The latest 5 transactions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.latestOrders.map((order: any) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium truncate max-w-[150px]">{order.userName}</TableCell>
                                        <TableCell className="text-right font-bold">
                                            ${order.total_price.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {stats.latestOrders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center">
                                            No recent orders.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
