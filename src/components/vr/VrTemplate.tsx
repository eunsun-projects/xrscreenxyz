'use client';

import useVrStore, { VrStore } from '@/zustand/vr.store';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { VrModel } from '../types/vr.type';
import MpWebComp from './MpWebComp';
import Start from './Start';
import Video from './Video';

interface VrTemplateProps {
  model: VrModel;
}

function VrTemplate({ model }: VrTemplateProps) {
  const { setEmbed } = useVrStore(
    useShallow((state: VrStore) => ({
      setEmbed: state.setEmbed,
    })),
  );

  useEffect(() => {
    if (window.innerHeight < 400 && window.parent) {
      setEmbed({ isEmbed: true, isEmbedMiddle: false });
    }
    if (window.innerHeight >= 400 && window.innerHeight <= 600) {
      setEmbed({ isEmbed: false, isEmbedMiddle: true });
    }
  }, [setEmbed]);

  return (
    <>
      <Video model={model} />
      <Start title={model.title} />
      <MpWebComp model={model} />
    </>
  );
}

export default VrTemplate;
