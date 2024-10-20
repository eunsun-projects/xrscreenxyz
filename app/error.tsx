'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export const metadata = {
  title: 'error :(',
  description: 'some error occured!',
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
    title: 'error :(',
    description: 'some error occured!',
    url: 'https://xr.screenxyz.net',
    siteName: 'screenxyz hub',
    images: [
      {
        url: '/logo512.png',
        width: 512,
        height: 512,
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
    title: 'error :(',
    description: 'some error occured!',
    creator: 'screenxyz',
    images: ['/logo192_3.png'],
  },
};

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-screen-blue flex flex-col justify-center items-center gap-[2rem] w-full h-dvh overflow-auto">
      <p className="text-[3rem] md:text-[5rem] text-shadow-screen">Error</p>
      <Link href={'/'}>
        <p className="text-[1.5rem] md:text-[2rem] text-shadow-screen">← return Home</p>
      </Link>
    </div>
  );
}
