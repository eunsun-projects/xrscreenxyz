'use client';
import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { Model } from '../../../public/matterport-assets/sdk';
import { VrModel } from '../types/vr.type';
import { changeBottomLogo, customizeVr, shareControl } from './lib';
const MatterportViewer = dynamic(
  () => import('@matterport/r3f').then((module) => ({ default: module.MatterportViewer })),
  { ssr: false },
);

interface ExtendedIframe extends HTMLIFrameElement {
  contentWindow: Window & {
    document: Document;
  };
}
export type Viewer = typeof MatterportViewer & {
  contentWindow: ExtendedIframe['contentWindow'];
};
// const mpSdk = useMatterportSdk();
// useMatterportSdk 훅은 r3f 캔버스 컴포넌트의 자식들(예를들어 Box 등) 에서만 사용 가능
// 같은 레벨에서 쓸거면 onPlaying 에서 받아서 써야함!!!
interface MpWebCompProps {
  model: VrModel;
}

export default function MpWebComp({ model }: MpWebCompProps) {
  const {
    isWebCompReady,
    setIsWebCompReady,
    setDropdownData,
    videoRef,
    audioRef,
    setModelInfo,
    setIsDropdownReady,
    setMpSdk,
    setViewerRef,
  } = useVrStore(
    useShallow((state: VrStore) => ({
      isWebCompReady: state.isWebCompReady,
      setIsWebCompReady: state.setIsWebCompReady,
      setDropdownData: state.setDropdownData,
      videoRef: state.videoRef,
      audioRef: state.audioRef,
      setModelInfo: state.setModelInfo,
      setMpSdk: state.setMpSdk,
      setIsDropdownReady: state.setIsDropdownReady,
      setViewerRef: state.setViewerRef,
    })),
  );

  const mpWrapperRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer>(null);

  const handleConnected = () => {
    const mpDom = document.querySelector('#mpviewer')?.shadowRoot;
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '/mpcustom.css');
    mpDom?.appendChild(linkElem);
  };

  const handleOnPlaying = async (mpSdk: MpSdk) => {
    setIsWebCompReady(true);
    const dropdownData = await customizeVr(mpSdk, model);
    setDropdownData(dropdownData);
    if (viewerRef.current) {
      setViewerRef(viewerRef);
      changeBottomLogo(viewerRef.current);
      shareControl(mpSdk, model, viewerRef.current);
    }
    const modelInfo: Model.ModelDetails = await mpSdk.Model.getDetails();
    setModelInfo(modelInfo);
    setIsDropdownReady(true);
    setMpSdk(mpSdk);
  };

  useEffect(() => {
    if (!mpWrapperRef.current || !videoRef || !audioRef) return;
    /** ============ EventListener-IOSsounduUnlocker =============== */
    const handleUnlockMedia = () => {
      if (document.activeElement === mpWrapperRef.current?.firstElementChild) {
        if (videoRef.current && model.video[0]) {
          videoRef.current.muted = false;
          videoRef.current.pause();
        }
      }
      if (audioRef.current && model.bgm[0]) audioRef.current.muted = false;
      window.focus();
      window.removeEventListener('click', handleUnlockMedia);
    };
    window.addEventListener('click', handleUnlockMedia);
    return () => {
      window.removeEventListener('click', handleUnlockMedia);
    };
  }, [audioRef, videoRef, model]);

  return (
    <div className={cn('opacity-0', isWebCompReady && 'opacity-100')} ref={mpWrapperRef}>
      <MatterportViewer
        id="mpviewer"
        m={model.sid}
        ref={viewerRef}
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
        onConnected={handleConnected}
        onPlaying={handleOnPlaying}
      ></MatterportViewer>
    </div>
  );
}
