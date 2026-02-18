import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const client = await clerkClient()
        // Fetch all users from Clerk (limit to 100 for now, can implement pagination if needed)
        const { data: users } = await client.users.getUserList({ limit: 100 })

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const results = []

        for (const user of users) {
            const email = user.emailAddresses[0]?.emailAddress
            const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

            if (user.id && email) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: email,
                        role: 'customer', // Default role matching Supabase enum
                        // name: name,
                    })

                if (error) {
                    console.error(`Failed to sync user ${user.id}:`, error)
                    results.push({ id: user.id, status: 'failed', error: error.message })
                } else {
                    results.push({ id: user.id, status: 'synced' })
                }
            }
        }

        return NextResponse.json({
            success: true,
            count: users.length,
            results
        })

    } catch (error) {
        console.error('Sync failed:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
