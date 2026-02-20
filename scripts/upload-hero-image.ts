import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage() {
    const imagePath = 'C:\\Users\\Hanz Mapua\\.gemini\\antigravity\\brain\\ad277496-165c-4bde-a3e1-5fc7cacb9b7a\\lifestyle_smartwatch_video_thumbnail_1771596221112.png';
    const fileContent = fs.readFileSync(imagePath);
    const fileName = `hero-video-thumbnail-${Date.now()}.png`;

    console.log("Uploading to product-images bucket...");
    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, fileContent, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error("Upload failed:", error);
        process.exit(1);
    }

    const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

    console.log("UPLOAD_SUCCESS_URL:", publicUrlData.publicUrl);
}

uploadImage();
