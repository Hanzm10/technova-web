'use server'

import { createClerkSupabaseClient } from "@/utils/supabase/server"

export async function getDashboardStats() {
    const supabase = await createClerkSupabaseClient()

    // 1. Total Revenue (all time completed orders)
    const { data: orders } = await supabase
        .from('orders')
        .select('total_price, created_at')

    const totalRevenue = orders?.reduce((acc, order) => acc + (order.total_price || 0), 0) || 0
    const orderCount = orders?.length || 0
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0

    // 2. Total Users
    const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // 3. Sales Trend (Last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentOrders } = await supabase
        .from('orders')
        .select('total_price, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    // Aggregate by day
    const trendMap = new Map()
    for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        trendMap.set(dateStr, 0)
    }

    recentOrders?.forEach(order => {
        const dateStr = order.created_at?.split('T')[0]
        if (trendMap.has(dateStr)) {
            trendMap.set(dateStr, trendMap.get(dateStr) + order.total_price)
        }
    })

    const salesTrend = Array.from(trendMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))

    // 4. Recent Activity (Last 5 orders)
    const { data: latestOrders } = await supabase
        .from('orders')
        .select('id, user_id, total_price, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    // 5. Enrich with Clerk User Data
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()

    const enrichedOrders = await Promise.all((latestOrders || []).map(async (order) => {
        try {
            const user = await client.users.getUser(order.user_id)
            return {
                ...order,
                userName: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Anonymous'
            }
        } catch (e) {
            return { ...order, userName: 'User Not Found' }
        }
    }))

    return {
        totalRevenue,
        orderCount,
        aov,
        userCount: userCount || 0,
        salesTrend,
        latestOrders: enrichedOrders
    }
}
