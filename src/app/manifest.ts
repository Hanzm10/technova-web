import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TechNova',
        short_name: 'TechNova',
        description: 'A digital-first lifestyle brand for modern living.',
        start_url: '/',
        display: 'standalone',
        background_color: '#E8ECEF',
        theme_color: '#0F172A',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
