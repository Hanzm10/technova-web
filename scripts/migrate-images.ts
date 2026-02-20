import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// We need the service role key to bypass RLS when updating products from a script
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Key in environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
    console.log('Fetching products from database...')
    const { data: products, error } = await supabase.from('products').select('*')

    if (error || !products) {
        console.error('Error fetching products:', error)
        return
    }

    console.log(`Found ${products.length} products.`)

    for (const product of products) {
        if (product.image && product.image.startsWith('http') && !product.image.includes('supabase.co')) {
            console.log(`\nMigrating image for product: ${product.name} (ID: ${product.id})`)
            console.log(`Old URL: ${product.image}`)

            try {
                // Download image
                const response = await fetch(product.image)
                if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
                const arrayBuffer = await response.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                // determine extension from content-type or url
                let ext = 'jpg'
                const contentType = response.headers.get('content-type')
                if (contentType && contentType.includes('/')) {
                    ext = contentType.split('/')[1]
                    // clean up some weird extensions
                    if (ext === 'jpeg') ext = 'jpg'
                    if (ext.includes(';')) ext = ext.split(';')[0]
                }

                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

                // Upload to supabase
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, buffer, {
                        contentType: contentType || 'image/jpeg',
                        upsert: false
                    })

                if (uploadError) {
                    console.error(`Failed to upload ${fileName} to storage:`, uploadError)
                    continue
                }

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName)

                const newUrl = publicUrlData.publicUrl
                console.log(`Uploaded to: ${newUrl}`)

                // Update product database record
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ image: newUrl })
                    .eq('id', product.id)

                if (updateError) {
                    console.error(`Failed to update product ${product.id} in DB:`, updateError)
                } else {
                    console.log(`Successfully migrated ${product.name}`)
                }
            } catch (err) {
                console.error(`Error processing ${product.name}:`, err)
            }
        } else {
            console.log(`\nSkipping product ${product.name} (already migrated or no external URL)`)
        }
    }

    console.log('\nMigration complete.')
}

migrate()
