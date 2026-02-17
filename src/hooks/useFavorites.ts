'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useUser, useClerk } from '@clerk/nextjs'
import { useToastStore } from '@/hooks/useToastStore'

export function useFavorites() {
    const { user, isSignedIn } = useUser()
    const { openSignIn } = useClerk()
    const [favoriteIds, setFavoriteIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { addToast } = useToastStore()
    const supabase = createClient()

    // Fetch favorites on mount or when user changes
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isSignedIn || !user) {
                setFavoriteIds([])
                return
            }

            setIsLoading(true)
            try {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('product_id')
                    .eq('user_id', user.id)

                if (error) throw error
                setFavoriteIds(data.map((fav: { product_id: string }) => fav.product_id))
            } catch (error) {
                console.error('Error fetching favorites:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFavorites()
    }, [user, isSignedIn, supabase])

    const isFavorite = (productId: string) => favoriteIds.includes(productId)

    const toggleFavorite = async (productId: string) => {
        if (!isSignedIn) {
            openSignIn()
            return
        }

        const isFav = isFavorite(productId)

        // Optimistic update
        const newFavorites = isFav
            ? favoriteIds.filter(id => id !== productId)
            : [...favoriteIds, productId]

        setFavoriteIds(newFavorites)

        try {
            if (isFav) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', productId)

                if (error) throw error
                addToast('Removed from favorites', 'info')
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert({ user_id: user.id, product_id: productId })

                if (error) throw error
                addToast('Added to favorites', 'success')
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            // Rollback optimistic update
            setFavoriteIds(favoriteIds)
            addToast('Failed to update favorites', 'error')
        }
    }

    return {
        favoriteIds,
        isFavorite,
        toggleFavorite,
        isLoading
    }
}
