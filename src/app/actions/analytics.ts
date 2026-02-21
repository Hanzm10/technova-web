'use server'

import { getUserRole } from "@/utils/supabase/server"

export async function getDashboardStats() {
    const role = await getUserRole()
    if (role !== 'admin') {
        throw new Error('Unauthorized: Admin access required')
    }

    // Use Service Role Key to bypass RLS for analytics
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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

    // 3. Sales Trend & Growth (Last 7 days vs Previous 7 days)
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const { data: currentPeriodOrders } = await supabase
        .from('orders')
        .select('total_price, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

    const { data: previousPeriodOrders } = await supabase
        .from('orders')
        .select('total_price, created_at')
        .gte('created_at', fourteenDaysAgo.toISOString())
        .lt('created_at', sevenDaysAgo.toISOString())

    const currentRevenue = currentPeriodOrders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
    const previousRevenue = previousPeriodOrders?.reduce((acc, o) => acc + (o.total_price || 0), 0) || 0
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

    const currentOrderCount = currentPeriodOrders?.length || 0
    const previousOrderCount = previousPeriodOrders?.length || 0
    const orderGrowth = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0

    // User growth
    const { count: previousUserCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', sevenDaysAgo.toISOString())

    const userGrowth = (previousUserCount || 0) > 0 ? (((userCount || 0) - (previousUserCount || 0)) / (previousUserCount || 0)) * 100 : 0

    // Aggregate trend by day
    const trendMap = new Map()
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const dateStr = d.toISOString().split('T')[0]
        trendMap.set(dateStr, 0)
    }

    currentPeriodOrders?.forEach(order => {
        const dateStr = order.created_at?.split('T')[0]
        if (trendMap.has(dateStr)) {
            trendMap.set(dateStr, trendMap.get(dateStr) + order.total_price)
        }
    })

    const salesTrend = Array.from(trendMap.entries())
        .map(([date, amount]) => ({ date, amount }))

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
            const firstName = user.firstName || ''
            const lastName = user.lastName || ''
            const fullName = `${firstName} ${lastName}`.trim()
            return {
                ...order,
                userName: fullName || user.username || 'Anonymous'
            }
        } catch (e) {
            return { ...order, userName: 'User Not Found' }
        }
    }))

    // 6. Top Selling Products (By Revenue)
    const { data: topProductsData } = await supabase
        .from('order_items')
        .select('product_id, quantity, price, products(name, category)')

    const productStats = new Map()
    topProductsData?.forEach((item: any) => {
        const id = item.product_id
        const current = productStats.get(id) || { name: item.products.name, category: item.products.category, revenue: 0, units: 0 }
        current.revenue += item.price * item.quantity
        current.units += item.quantity
        productStats.set(id, current)
    })

    const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

    // 7. Revenue by Category
    const categoryStats = new Map()
    topProductsData?.forEach((item: any) => {
        const cat = item.products.category
        const current = categoryStats.get(cat) || 0
        categoryStats.set(cat, current + (item.price * item.quantity))
    })

    const categoryRevenue = Array.from(categoryStats.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

    return {
        totalRevenue,
        orderCount,
        aov,
        userCount: userCount || 0,
        salesTrend,
        latestOrders: enrichedOrders,
        topProducts,
        categoryRevenue,
        growth: {
            revenue: revenueGrowth,
            orders: orderGrowth,
            users: userGrowth
        }
    }
}
