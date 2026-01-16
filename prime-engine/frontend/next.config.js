/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['firebase', '@firebase/auth', '@firebase/app'],
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        esmExternals: 'loose',
    },
    images: {
        domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals.push('undici');
        }
        return config;
    },
}

module.exports = nextConfig
