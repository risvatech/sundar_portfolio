// next.config.js (single file)
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable output: 'export' only when NEXT_EXPORT=true
    output: "standalone",

    images: {
        unoptimized: true,
        domains: ['localhost', '127.0.0.1', 'www.sundara-moorthy.com', 'sundara-moorthy.com'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5002',
                pathname: '/api/uploads/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '5002',
                pathname: '/api/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'sundara-moorthy.com',
                pathname: '/api/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'www.sundara-moorthy.com',
                pathname: '/api/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
        ],
    },
    compiler: {
        removeConsole: {
            exclude: ['error', 'warn'],
        },
    },

    // Only apply these when doing static export
    ...(process.env.NEXT_EXPORT === 'true' ? {
        trailingSlash: true,
        eslint: {
            ignoreDuringBuilds: true,
        },
        typescript: {
            ignoreBuildErrors: true,
        },
    } : {}),
};

module.exports = nextConfig;