
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

export async function createClerkSupabaseClient() {
    const { getToken } = await auth()

    let token = null;
    try {
        // The `supabase` template must be configured in your Clerk Dashboard
        token = await getToken({ template: 'supabase' })
    } catch (error) {
        console.warn('Failed to fetch Clerk Supabase token (user might be logged out):', error);
    }

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

export async function getUserRole() {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = await createClerkSupabaseClient()
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()



    return profile?.role || null
}
