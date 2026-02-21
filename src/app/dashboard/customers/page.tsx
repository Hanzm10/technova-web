import { Badge } from "@/components/ui/badge"
export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClerkSupabaseClient } from "@/utils/supabase/server"
import { clerkClient } from "@clerk/nextjs/server"
import { DashboardMobileCard, DashboardMobileCardItem } from "@/components/dashboard/DashboardMobileCard"
import Image from "next/image"
import { formatDateTime } from "@/lib/utils"


export default async function CustomersPage() {
    const supabase = await createClerkSupabaseClient()
    const { data: profiles } = await supabase
        .from('profiles')
        .select(`
            *,
            orders (
                total_price,
                status
            )

        `)
        .order('created_at', { ascending: false })

    const client = await clerkClient()
    const users = await Promise.all((profiles || []).map(async (profile: any) => {
        try {
            const user = await client.users.getUser(profile.id)
            return {
                ...profile,
                id: profile.id,
                name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Anonymous',
                image_url: user.imageUrl,

                email: profile.email,
                totalSpent: (profile.orders as any[] || []).filter(o => o.status === 'completed').reduce((acc, o) => acc + Number(o.total_price || 0), 0),

                orderCount: (profile.orders as any[] || []).length
            }
        } catch (e) {
            return {
                ...profile,
                id: profile.id,
                name: 'Unknown User',
                image_url: '',
                email: profile.email,
                totalSpent: 0,
                orderCount: 0
            }
        }
    }))

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Customer Core</h1>
                <p className="text-slate-500 font-medium tracking-tight">Managing your global user ecosystem.</p>
            </div>

            <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-4 md:p-8 border border-white/40">
                <CardHeader className="px-2 pb-8">
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter text-shadow-sm">Identity Directory</CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">Browse and manage active customer profiles.</CardDescription>

                </CardHeader>
                <CardContent className="px-0">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100/50">
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Customer</TableHead>
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Email</TableHead>
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter text-right">Orders</TableHead>
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter text-right">Total Spent</TableHead>
                                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Joined</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user: any) => (
                                    <TableRow key={user.id} className="hover:bg-slate-50/50 border-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-10 w-10 border-2 border-white shadow-sm rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                                                    {user.image_url ? (
                                                        <Image src={user.image_url} alt={user.name} fill className="object-cover" />
                                                    ) : (
                                                        <span className="text-slate-900 font-black text-xs">{user.name?.charAt(0) || 'U'}</span>
                                                    )}
                                                </div>

                                                <span className="font-bold text-slate-900">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 font-medium lowercase italic">{user.email}</TableCell>

                                        <TableCell className="text-right font-black text-slate-900">
                                            {user.orderCount}
                                        </TableCell>
                                        <TableCell className="text-right font-black text-emerald-600">
                                            ${user.totalSpent.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-400 font-mono text-[10px] whitespace-nowrap">
                                            {formatDateTime(user.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4 px-2">
                        {users.map((user: any) => (
                            <DashboardMobileCard
                                key={user.id}
                                title={user.name}
                                subtitle={user.email}
                                status={
                                    <Badge variant="outline" className="rounded-full bg-white text-slate-900 border-slate-200 px-2 py-0 font-bold text-[9px] uppercase tracking-tight shadow-sm">
                                        {user.role}
                                    </Badge>
                                }
                            >
                                <DashboardMobileCardItem label="Total Spent" value={`$${user.totalSpent.toFixed(2)}`} />
                                <DashboardMobileCardItem label="Orders" value={user.orderCount.toString()} />
                                < DashboardMobileCardItem label="Joined" value={formatDateTime(user.created_at)} />
                                <DashboardMobileCardItem label="Email" value={user.email} />
                                <DashboardMobileCardItem label="User ID" value={user.id.slice(0, 12) + '...'} />
                            </DashboardMobileCard>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
