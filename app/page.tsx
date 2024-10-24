import IfLandscape from '@/components/common/IfLandscape';
import HubTemplate from '@/components/main/HubTemplate';
import { basicMetadata } from '@/data/basicMeta.data';
import { hubData } from '@/data/hub.data';
import { cn, korean } from '@/utils/common';
import Link from 'next/link';

export const metadata = basicMetadata;

export default function MainPage() {
  return (
    <>
      <IfLandscape />
      <div className="relative flex flex-col items-center h-auto min-h-dvh w-dvw text-[1rem] box-border bg-screen-blue">
        <div className="text-[2rem] text-shadow-screen w-[13rem] text-center leading-[5rem]">
          <p>screenxyz HUB</p>
        </div>

        <div className="font-[1.3rem] text-shadow-screen w-[14rem]">
          <ul>
            {hubData.main.map((item) => (
              <Link href={item.href} key={item.title}>
                <li
                  className={cn(
                    korean.test(item.title) ? 'text-[0.9rem]' : 'text-[1rem]',
                    'border border-screen-green mx-auto my-[1rem] pl-[0.2rem] h-[1.3rem] flex items-center leading-none',
                  )}
                >
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <HubTemplate />
      </div>
    </>
  );
}
