'use client';

import useVrStore, { VrStore } from '@/zustand/vr.store';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { VrModel } from '../types/vr.type';
import Start from './Start';

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
    if (window.innerHeight >= 400 && window.innerHeight <= 600 && window.parent) {
      setEmbed({ isEmbed: false, isEmbedMiddle: true });
    }
  }, [setEmbed]);

  return (
    <>
      <Start title={model.title} />
    </>
  );
}

export default VrTemplate;
