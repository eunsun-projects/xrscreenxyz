import styles from '@/styles/vas.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'virtual art space',
  description: 'virtual art space',
  generator: 'Next.js',
  applicationName: 'xrscreenxyz',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'screenxyz',
    'vr',
    'xr',
    'vas',
    'virtual art space',
    'xrscreenxyz',
    'exhibition',
    'gallery',
    'art',
    'music',
    'painting',
    'sculpture',
    'design',
  ],
  authors: [{ name: 'screenxyz' }, { name: 'screenxyz', url: 'https://xr.screenxyz.net' }],
  creator: 'screenxyz',
  publisher: 'screenxyz',
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
    title: 'virtual art space',
    description: 'virtual art space',
    url: 'https://xr.screenxyz.net/vas',
    siteName: 'screenxyz',
    images: [
      {
        url: '/assets/vas/img/vas_thumb.png',
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
};

export default function VasSelector() {
  return (
    <>
      <div
        className={styles.vasback}
        style={{ width: '100%', height: '100dvh', overflow: 'hidden' }}
      >
        <div className={styles.vasbox}>
          <p className={styles.vasguidetitle}>Virtual art space</p>
          <p className={styles.vasguide}>
            {`virtual art space는 Full 3D webGL 가상 공간 서비스입니다.\n현재 3타입의 공간을 선택하실 수 있으며,\n아래 메뉴에서 공간 유형을 선택하시면 해당 공간 페이지로 이동합니다.`}
          </p>
          <p className={styles.vasguideeg}>
            {`Virtual Art Space is a Full 3D WebGL virtual space service.\nCurrently, you can choose from three types of spaces.\nBy clicking on a space type, you will be redirected to that specific space page.`}
          </p>
          <div className={styles.line}></div>
          <div className={styles.spacebox}>
            <Link href={'/vas/square'}>
              <div className={styles.spacediv}>
                <div className={styles.squre}></div>
                <p style={{ color: '#00ffbe' }}>정방형공간</p>
              </div>
            </Link>

            <Link href={'/vas/rect'}>
              <div className={styles.spacediv}>
                <div className={styles.rectangular}></div>
                <p style={{ color: '#00ffbe' }}>세장형공간</p>
              </div>
            </Link>

            <Link href={'/vas/dig'}>
              <div className={styles.spacediv}>
                <div className={styles.tshapedbox}>
                  <div className={styles.tshaped1}></div>
                </div>
                <p style={{ color: '#00ffbe' }}>ㄷ자형공간</p>
              </div>
            </Link>
          </div>
          <div className={styles.line}></div>

          <div className={styles.vastohome}>
            <Link href={'/vas/sanctum'} style={{ color: '#00ffbe' }}>
              <p>virtual art space를 활용한 전시 보러 가기 →</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
