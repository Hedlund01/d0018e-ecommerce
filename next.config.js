/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'avatars.githubusercontent.com'
            },
            {
                hostname: '**.unsplash.com',
            },
            {
                hostname: '*'
            }
        ]
    }
};

module.exports = nextConfig;
