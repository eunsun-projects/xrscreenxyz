'use client';

import styles from '@/styles/loading.module.css';
import { cn } from '@/utils/common';
import useVrStore from '@/zustand/vr.store';

function EnterLoader({ isReady }: { isReady: boolean }) {
  const { embed } = useVrStore();

  return (
    <div
      className={cn(
        'relative h-full w-full flex justify-center items-center opacity-0',
        !isReady && 'opacity-100',
      )}
    >
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
