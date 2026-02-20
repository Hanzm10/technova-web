import { createBrowserClient } from '@supabase/ssr'

export function createClient(clerkToken?: string | null) {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: async (url, options = {}) => {
                    // Inject Clerk token if available on the client
                    let token = clerkToken
                    if (!token && typeof window !== 'undefined' && (window as any).Clerk?.session) {
                        try {
                            token = await (window as any).Clerk.session.getToken({ template: 'supabase' })
                        } catch (e) {
                            console.error('Error fetching clerk token:', e)
                        }
                    }

                    const headers = new Headers(options?.headers)
                    if (token) {
                        headers.set('Authorization', `Bearer ${token}`)
                    }

                    return fetch(url, {
                        ...options,
                        headers,
                    })
                },
            },
        }
    )
}
