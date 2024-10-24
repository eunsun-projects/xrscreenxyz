import { basicMetadata } from '@/data/basicMeta.data';
import { dunggeunmo } from '@/fonts';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata = basicMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${dunggeunmo.variable} text-screen-green font-dunggeunmo`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
