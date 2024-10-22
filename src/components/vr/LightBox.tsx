/* eslint-disable @next/next/no-img-element */
'use client';

import styles from '@/styles/dropdown.module.css';
import { Dispatch, memo, SetStateAction, useEffect, useRef, useState } from 'react';
import { GrZoomIn, GrZoomOut } from 'react-icons/gr';
import { Tag } from '../../../public/matterport-assets/sdk';

interface LightboxProps {
  attach: Tag.Attachment;
  setIsLightBoxOpen: Dispatch<SetStateAction<boolean>>;
  mobile: boolean;
}

function LightboxComp({ attach, setIsLightBoxOpen, mobile }: LightboxProps) {
  const [zoom, setZoom] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [glbSrc, setGlbSrc] = useState('');

  const lightboxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleExit = () => setIsLightBoxOpen((prev) => !prev);

  const handleZoom = () => {
    setZoom(true);
  };

  const handleZoomOut = () => {
    setZoom(false);
  };

  useEffect(() => {
    if (/.jpg|.png|.webp/.test(attach.src)) {
      setImgSrc(attach.src);
    } else if (attach.src.includes('glbs')) {
      setGlbSrc(attach.src);
    }

    let lastTouchEnd = 0;
    function preventMultiFingerTouch(e: TouchEvent) {
      if (e.touches.length > 1) e.preventDefault();
    }
    function preventDoubleTapZoom(e: TouchEvent) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    }
    const lightbox = lightboxRef.current;
    if (lightbox) {
      lightbox.addEventListener('touchstart', preventMultiFingerTouch, false);
      lightbox.addEventListener('touchend', preventDoubleTapZoom, false);
    }
    return () => {
      if (lightbox) {
        lightbox.removeEventListener('touchstart', preventMultiFingerTouch);
        lightbox.removeEventListener('touchend', preventDoubleTapZoom);
      }
    };
  }, [attach]);

  useEffect(() => {
    if (mobile) imgRef.current?.scrollBy(100, 0);
  }, [mobile]);

  return (
    <>
      <div className={styles.lightBoxBack} ref={lightboxRef}>
        <div className={styles.lightbox_exit} onClick={handleExit}>
          x
        </div>
        <div
          ref={imgRef}
          className={styles.lightBoxScroll}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: zoom ? 'flex-start' : 'center',
            overflowY: zoom ? 'scroll' : 'hidden',
          }}
        >
          <div
            className={styles.lightBoxCon}
            style={{
              transform: zoom ? 'scale(1.5)' : 'scale(1)',
              transformOrigin: mobile ? 'left top' : 'center top',
              objectPosition: 'center',
              objectFit: 'contain',
              marginTop: zoom ? '3rem' : '0rem',
            }}
          >
            {imgSrc && <img alt={styles.xyzlightbox} className={styles.lightBoxImg} src={imgSrc} />}
            {glbSrc && (
              <>
                <div className={styles.con3dArea}>
                  <model-viewer
                    src={glbSrc}
                    camera-controls
                    auto-rotate
                    alt="3dmodel"
                    shadow-intensity="1"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {imgSrc && (
          <div className={styles.zoomDiv}>
            <GrZoomIn className={styles.closeUp} onClick={handleZoom} />
            <GrZoomOut className={styles.closeOut} onClick={handleZoomOut} />
          </div>
        )}
      </div>
    </>
  );
}

const LightBox = memo(LightboxComp);
export default LightBox;
