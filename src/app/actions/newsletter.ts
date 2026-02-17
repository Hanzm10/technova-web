'use server'

import { createClerkSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return { error: 'Please enter a valid email address.' };
    }

    const supabase = await createClerkSupabaseClient();

    try {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email });

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { error: 'You are already subscribed!' };
            }
            console.error('Newsletter subscription error:', error);
            return { error: 'Something went wrong. Please try again.' };
        }

        revalidatePath('/');
        return { success: 'Thank you for subscribing!' };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: 'An unexpected error occurred.' };
    }
}
