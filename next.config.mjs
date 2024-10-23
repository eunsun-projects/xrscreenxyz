/** @type {import('next').NextConfig} */
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  webpack(config) {
    // config.module.rules.push({
    //   test: /\.ts$/,
    //   include: path.resolve(__dirname, 'src/components/vr/lib/media-modules'),
    //   use: 'babel-loader',
    // });
    // // Grab the existing rule that handles SVG imports
    // config.resolve.alias['@'] = path.resolve(__dirname, 'src');
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
