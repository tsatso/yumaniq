export default {
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: '/demos/heavy-machinery/:path*',
        destination: '/rx',
        permanent: false,
      },
    ]
  },
};