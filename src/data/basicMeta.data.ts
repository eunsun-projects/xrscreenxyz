import type { Metadata } from 'next';

export const basicMetadata: Metadata = {
  title: 'xr.screenxyz',
  description: 'screenxyz hub :)',
  generator: 'Next.js',
  applicationName: 'xrscreenxyz',
  referrer: 'origin-when-cross-origin',
  keywords: ['screenxyz', 'vr', 'xr'],
  authors: [{ name: 'Eun' }, { name: 'Eun', url: 'https://xr.screenxyz.net' }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://xr.screenxyz.net'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
    },
  },
  openGraph: {
    title: 'xr.screenxyz',
    description: 'screenxyz hub :)',
    url: 'https://xr.screenxyz.net',
    siteName: 'screenxyz hub',
    images: [
      {
        url: '/logo192_3.png',
        width: 192,
        height: 192,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: '/logo192_3.png',
    shortcut: '/logo192_3.png',
    apple: '/logo192_3.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo192_3.png',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'xr.screenxyz',
    description: 'screenxyz hub :)',
    creator: 'screenxyz',
    images: ['/logo512.png'],
  },
};
