import { vrData } from '@/data/vr.data';
import NotFound from '../not-found';

export async function generateStaticParams() {
  return vrData.map((post) => ({
    slug: post.unique,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const model = vrData.find((post) => post.unique === slug);

  if (slug.length > 1 && model && slug === model.unique) {
    return {
      title: model.unique,
      description: model.description,
      generator: 'Next.js',
      applicationName: 'xrscreenxyz',
      referrer: 'origin-when-cross-origin',
      keywords: ['screenxyz', 'vr', 'xr'],
      authors: [{ name: 'screenxyz' }, { name: 'screenxyz', url: 'https://xr.screenxyz.net' }],
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
        title: model.title, // db 상 모델 타이틀
        description: model.description, // db 상 모델 설명
        url: model.fullUrl, // db 상 모델 url
        siteName: "screenxyz's XR service",
        images: [
          {
            url: model.background,
            width: 800,
            height: 600,
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
        title: model.title,
        description: model.description,
        creator: 'screenxyz',
        images: [model.background],
      },
    };
  } else {
    return {
      title: 'error page!',
      description: 'error page',
      icons: {
        icon: '/logo192_3.png',
        shortcut: '/logo192_3.png',
        apple: '/logo192_3.png',
        other: {
          rel: 'apple-touch-icon-precomposed',
          url: '/logo192_3.png',
        },
      },
    };
  }
}

function VrPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const model = vrData.find((post) => post.unique === slug);
  if (!model) return <NotFound />;
  return <div>{model?.title}</div>;
}

export default VrPage;
