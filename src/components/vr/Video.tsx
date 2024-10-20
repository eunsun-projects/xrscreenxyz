'use client';

import useVrStore from '@/zustand/vr.store';
import { memo, useEffect, useRef, useState } from 'react';
import { VrModel } from '../types/vr.type';

interface VideoCompProps {
  model: VrModel;
}

function VideoComp({ model }: VideoCompProps) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [src, setSrc] = useState('');

  const videoReference = useRef<HTMLVideoElement>(null);
  const { setVideoRef } = useVrStore();

  useEffect(() => {
    // if(mpModels.video[1] === "low3_final.mp4"){
    //     console.log('조각모음 비디오 맞냐??????')
    //     setWidth('720');
    //     setHeight('1280');
    // }else{
    setWidth('320');
    setHeight('240');
    // }
    setSrc(model.video[1] as string);
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
        width={width}
        height={height}
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
