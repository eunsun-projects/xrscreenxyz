'use client';

import useVrStore from '@/zustand/vr.store';
import { memo, useEffect, useRef, useState } from 'react';
import { VrModel } from '../types/vr.type';

interface VideoCompProps {
  model: VrModel;
}

function VideoComp({ model }: VideoCompProps) {
  const [src, setSrc] = useState('');

  const videoReference = useRef<HTMLVideoElement>(null);
  const { setVideoRef } = useVrStore();

  useEffect(() => {
    setSrc(`/assets/videos/${model.video[1] as string}`);
  }, [model]);

  useEffect(() => {
    if (videoReference.current) {
      setVideoRef(videoReference);
    }
  }, [videoReference, setVideoRef]);

  return (
    <>
      <video
        id="myVideo"
        ref={videoReference}
        playsInline
        loop
        muted
        autoPlay
        width={240}
        height={320}
        src={src}
        typeof="video/mp4"
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      ></video>
    </>
  );
}

const Video = memo(VideoComp);
export default Video;
