/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Add HTTP headers to specific routes
  async headers() {
    return [
      {
        // Apply headers to the specific page that needs to be embedded in an iframe
        source: '/gpuonline', // Replace with your specific page path, e.g., /embed
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://eunoh.top', // Replace with the domain you want to allow
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://eunoh.top;", // Replace with allowed domains
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM http://localhost:3000', // Replace with the domain you want to allow
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3000;", // Replace with allowed domains
          },
        ],
      },
    ];
  },

  webpack(config) {
    // // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );
    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
