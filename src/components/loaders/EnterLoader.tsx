'use client';

import styles from '@/styles/loading.module.css';
import { cn } from '@/utils/common';
import useVrStore from '@/zustand/vr.store';

function EnterLoader({ isReady }: { isReady: boolean }) {
  const { embed } = useVrStore();

  return (
    <div className={cn('relative h-full w-full opacity-0', isReady && 'opacity-100')}>
      <div className="flex justify-center items-center w-full h-1/2 text-white text-[1.1rem] text-center mx-auto transition-all duration-500">
        <p>loading</p>
      </div>
      <div
        className={cn(
          'w-full h-1/2 flex justify-center items-center',
          embed.isEmbedMiddle && 'h-[4.5rem]',
        )}
      >
        <div className={styles.loadercircle}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default EnterLoader;
