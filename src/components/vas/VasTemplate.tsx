'use client';

import { VasInformProvider } from '@/context/vasInform.context';
import { LoadingProvider } from '@/context/vasLoading.context';
import styles from '@/styles/vas.module.css';
import { useEffect, useState } from 'react';
import VasNavHelp from './VasNavHelp';

export default function VasTemplate({ title }: { title: string }) {
  const [mobile, setMobile] = useState<boolean | null>(null);

  function isMobile() {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    if (mobile) return true;
  }

  useEffect(() => {
    const isMob = isMobile();
    if (isMob) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    /** ============ set screensize =============== */
    function setScreenSize() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    /** ====== Generate a resize event if the device doesn't do it ====== */
    window.addEventListener(
      'orientationchange',
      () => window.dispatchEvent(new Event('resize')),
      false,
    );
    window.addEventListener('resize', setScreenSize);
    window.dispatchEvent(new Event('resize'));

    return () => {
      window.removeEventListener(
        'orientationchange',
        () => window.dispatchEvent(new Event('resize')),
        false,
      );
      window.removeEventListener('resize', setScreenSize);
    };
  }, []);

  return (
    <>
      <LoadingProvider>
        <VasInformProvider>
          <div className={styles.xyznonelandscape}>
            <h3>Looks good in portrait mode!</h3>
          </div>

          <div className={styles.vasgui}>
            <VasNavHelp title={title} mobile={mobile} />
          </div>
        </VasInformProvider>
      </LoadingProvider>
    </>
  );
}
