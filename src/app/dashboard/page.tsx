import { getDashboardStats } from "@/app/actions/analytics"
export const dynamic = 'force-dynamic'

import { StatsCard } from "@/components/dashboard/StatsCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Executive Summary</h1>
                <p className="text-slate-500 font-medium">Real-time metrics and business intelligence overview.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    description={`${stats.growth.revenue >= 0 ? '+' : ''}${stats.growth.revenue.toFixed(1)}% vs last week`}
                    icon={DollarSign}
                    trend={stats.growth.revenue > 0 ? 'up' : stats.growth.revenue < 0 ? 'down' : 'neutral'}
                />
                <StatsCard
                    title="Customers"
                    value={stats.userCount}
                    description={`${stats.growth.users >= 0 ? '+' : ''}${stats.growth.users.toFixed(1)}% vs last week`}
                    icon={Users}
                    trend={stats.growth.users > 0 ? 'up' : stats.growth.users < 0 ? 'down' : 'neutral'}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.orderCount}
                    description={`${stats.growth.orders >= 0 ? '+' : ''}${stats.growth.orders.toFixed(1)}% vs last week`}
                    icon={ShoppingCart}
                    trend={stats.growth.orders > 0 ? 'up' : stats.growth.orders < 0 ? 'down' : 'neutral'}
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={`$${stats.aov.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    description="Revenue per order"
                    icon={TrendingUp}
                    trend="neutral"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-6 border border-white/40">
                    <CardHeader className="px-2 pb-6">
                        <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Revenue Growth</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Sales trend over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <RevenueChart data={stats.salesTrend} />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-6 border border-white/40">
                    <CardHeader className="px-2 pb-6">
                        <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Recent Sales</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Latest transaction activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-slate-100/50">
                                        <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">User</TableHead>
                                        <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.latestOrders.map((order: any) => (
                                        <TableRow key={order.id} className="hover:bg-slate-50/50 border-slate-50/50 transition-colors">
                                            <TableCell className="font-bold text-slate-900 py-4 truncate max-w-[150px]">{order.userName}</TableCell>
                                            <TableCell className="text-right font-black text-slate-900">
                                                ${order.total_price.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stats.latestOrders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-32 text-center text-slate-400 font-medium italic">
                                                No recent orders.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
