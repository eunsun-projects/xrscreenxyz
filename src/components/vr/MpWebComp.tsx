'use client';
import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import { MpSdk } from '@matterport/r3f';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { VrModel } from '../types/vr.type';
import { customizeVr } from './lib';
const MatterportViewer = dynamic(
  () => import('@matterport/r3f').then((module) => ({ default: module.MatterportViewer })),
  { ssr: false },
);

// const mpSdk = useMatterportSdk();
// useMatterportSdk 훅은 r3f 캔버스 컴포넌트의 자식들(예를들어 Box 등) 에서만 사용 가능
// 같은 레벨에서 쓸거면 onPlaying 에서 받아서 써야함!!!

interface MpWebCompProps {
  model: VrModel;
}

export default function MpWebComp({ model }: MpWebCompProps) {
  const { isWebCompReady, setIsWebCompReady, setDropdownData } = useVrStore(
    useShallow((state: VrStore) => ({
      isWebCompReady: state.isWebCompReady,
      setIsWebCompReady: state.setIsWebCompReady,
      setDropdownData: state.setDropdownData,
    })),
  );

  const mpWrapperRef = useRef<HTMLDivElement>(null);

  const handleReady = () => {
    const mpDom = document.querySelector('#mpviewer')?.shadowRoot;
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '/mpcustom.css');
    mpDom?.appendChild(linkElem);
  };

  const handleLoading = async (mpSdk: MpSdk) => {
    setIsWebCompReady(true);
    const dropdownData = await customizeVr(mpSdk, model);
    setDropdownData(dropdownData);
  };

  useEffect(() => {
    if (!mpWrapperRef.current) return;
    /** ============ EventListener-IOSsounduUnlocker =============== */
    const handleUnlockMedia = () => {
      if (document.activeElement === mpWrapperRef.current?.firstElementChild) {
        // if(mpModels.video[0]) {
        //     videoRef.current.muted = false;
        //     videoRef.current.pause();
        // }
        // if(mpModels.isBgm[0]) audioRef.current.muted = false;
        window.focus();
        window.removeEventListener('click', handleUnlockMedia);
      }
    };
    window.addEventListener('click', handleUnlockMedia);

    return () => {
      window.removeEventListener('click', handleUnlockMedia);
    };
  }, []);

  return (
    <div className={cn('opacity-0', isWebCompReady && 'opacity-100')} ref={mpWrapperRef}>
      <MatterportViewer
        id="mpviewer"
        m={model.sid}
        params={{
          newtags: '1',
          lang: 'en',
          play: '1',
          title: '0',
          brand: '0',
          qs: '1',
          help: '0',
          useLegacyIds: '0',
        }}
        assetBase="matterport-assets/"
        applicationKey={process.env.NEXT_PUBLIC_MPSDKKEY}
        onConnected={handleReady}
        onPlaying={handleLoading}
      ></MatterportViewer>
    </div>
  );
}
