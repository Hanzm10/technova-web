
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

export async function createClerkSupabaseClient() {
    const { getToken } = await auth()

    // The `supabase` template must be configured in your Clerk Dashboard
    const token = await getToken({ template: 'supabase' })

    // If no token, we can return a client but it might not have auth context
    // depending on your RLS policies. For now, let's assume authenticated access.

    const headers: Record<string, string> = {}

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers
            }
        }
    )
}
