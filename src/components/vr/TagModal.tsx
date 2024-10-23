/* eslint-disable @next/next/no-img-element */
'use client';

import styles from '@/styles/dropdown.module.css';
import { linkUrl, vimeoUrl, youtubeUrl } from '@/utils/common';
import useVrStore from '@/zustand/vr.store';
import { memo, useEffect, useRef, useState } from 'react';
import { GrZoomIn } from 'react-icons/gr';
import { Tag } from '../../../public/matterport-assets/sdk';
import VideoLoader from '../loaders/VideoLoader';
import { CustomTagData } from '../types/vr.type';
import LightBox from './LightBox';

interface TagModalProps {
  tag: CustomTagData;
  mpSdk: MpSdk;
  attachs: Tag.Attachment[] | null | undefined;
}
function TagModalComp({ tag, mpSdk, attachs }: TagModalProps) {
  const { setModalState } = useVrStore();
  const popupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // 첨부 비디오의 ref
  const [mobile, setMobile] = useState(false);
  const [customizedTag, setCustomizedTag] = useState<CustomTagData>(tag);
  const [selectedAttachment, setSelectedAttachment] = useState<Tag.Attachment | null>(null); // 선택된 태그 어태치
  const [youtube, setYoutube] = useState(''); // youtube 주소 처리
  const [vimeo, setVimeo] = useState(''); // vimeo 주소 처리
  const [videoState, setVideoState] = useState({ width: 0, height: 0, loaded: false });
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);

  const handleExit = () => {
    mpSdk.Tag.close(tag.id);
    mpSdk.Camera.zoomReset();
    mpSdk.Camera.rotate(1, 1);
    setModalState({ type: null, isOpen: false, selectedTag: null });
  };

  const handleLightBox = () => setIsLightBoxOpen((prev) => !prev);

  const handleLoadedMetaData = () => {
    const vHeight = videoRef.current?.videoHeight;
    const vWidth = videoRef.current?.videoWidth;
    if (vHeight && vWidth) setVideoState({ width: vWidth / 2, height: vHeight / 2, loaded: true });
  };

  useEffect(() => {
    function youtubeParser(url: string, ...groups: string[]) {
      const base = 'https://www.youtube.com/embed/#ID#';
      return groups && groups[6].length === 11 ? base.replace('#ID#', groups[6]) : url;
    }
    function vimeoParser(url: string, ...groups: string[]) {
      const base = 'https://player.vimeo.com/video/#ID#';
      return groups[3].length === 9 ? base.replace('#ID#', groups[3]) : url;
    }
    function linkParser(...groups: string[]) {
      const linkcontainer = `<a href="${groups[2]}" target="_blank" class=${styles.link}>${groups[1]}</a>`;
      return linkcontainer;
    }
    const copiedTag = { ...tag };
    const parsedLink = copiedTag.description.replace(linkUrl, linkParser); // change link pattern
    const ridBr = parsedLink.replace(/\n/g, '<br />'); // change n to br
    const changedLink = ridBr.replace(/\{([^\]\[\r\n]*)\}/g, ''); // delete {***} pattern
    copiedTag.description = changedLink;
    setCustomizedTag(copiedTag);

    const attach = attachs?.find((attach) => tag.customAttachments.includes(attach.id));
    const src = attach?.src;
    if (!attach) return;
    if (src?.includes('youtu')) {
      const replaced = src.replace(youtubeUrl, youtubeParser);
      setYoutube(replaced);
      setSelectedAttachment(attach);
    } else if (src?.includes('vimeo')) {
      const replaced = src.replace(vimeoUrl, vimeoParser);
      setVimeo(replaced);
      setSelectedAttachment(attach);
    } else {
      setSelectedAttachment(attach);
    }
  }, [attachs, tag]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
    const popUp = popupRef.current;
    let lastTouchEnd = 0;
    function preventMultiFingerTouch(e: TouchEvent) {
      if (e.touches.length > 1) e.preventDefault();
    }
    function preventDoubleTapZoom(e: TouchEvent) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    }
    if (popUp) {
      popUp.addEventListener('touchstart', preventMultiFingerTouch, false);
      popUp.addEventListener('touchend', preventDoubleTapZoom, false);
    }
    return () => {
      if (popUp) {
        popUp.removeEventListener('touchstart', preventMultiFingerTouch);
        popUp.removeEventListener('touchend', preventDoubleTapZoom);
      }
    };
  }, []);

  console.log('첨부파일 =======>', selectedAttachment);

  return (
    <>
      {isLightBoxOpen && selectedAttachment && (
        <LightBox
          attach={selectedAttachment}
          setIsLightBoxOpen={setIsLightBoxOpen}
          mobile={mobile}
        />
      )}
      <div className={styles.popup_overlay} ref={popupRef}>
        <div className={styles.popup_exit} onClick={handleExit}>
          x
        </div>
        <div className={styles.txtArea}>
          <div className={styles.txtTitleArea}>
            <h2 className={styles.txtEleT}>{tag.label}</h2>
          </div>
          {selectedAttachment && (
            <>
              {selectedAttachment.type === 'tag.attachment.image' && (
                <div className={styles.imgArea}>
                  <img alt="xyz" src={selectedAttachment.src} onClick={handleLightBox}></img>
                </div>
              )}
              {selectedAttachment.type === 'tag.attachment.rich' &&
                selectedAttachment.src.includes('.gif') && (
                  <div className={styles.imgArea}>
                    <img alt="xyz" src={selectedAttachment.src} onClick={handleLightBox}></img>
                  </div>
                )}
              {selectedAttachment.type === 'tag.attachment.rich' &&
                selectedAttachment.src.includes('.mp4') && (
                  <div className={styles.imgMp4Area}>
                    <video
                      ref={videoRef}
                      playsInline
                      loop
                      muted
                      autoPlay
                      onLoadedMetadata={handleLoadedMetaData}
                      width={mobile ? videoState.width / 2 : videoState.width}
                      height={mobile ? videoState.height / 2 : videoState.height}
                      src={selectedAttachment.src}
                      typeof="video/mp4"
                      crossOrigin="anonymous"
                      style={{
                        opacity: videoState.loaded ? 1 : 0,
                        transition: 'opacity 0.5s ease-in',
                      }}
                    />
                    {!videoState.loaded && <VideoLoader />}
                  </div>
                )}
              {selectedAttachment.src.includes('.glb') && !isLightBoxOpen && (
                <>
                  <div className={styles.con3dArea}>
                    <model-viewer
                      src={selectedAttachment.src}
                      camera-controls
                      auto-rotate
                      alt="3dmodel"
                      shadow-intensity="1"
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    <GrZoomIn className={styles.closeUp} onClick={handleLightBox} />
                  </div>
                </>
              )}
              {youtube.length > 0 && (
                <div className={styles.video_container}>
                  <iframe
                    src={youtube}
                    width="100%"
                    height="100%"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {vimeo.length > 0 && (
                <div className={styles.video_container}>
                  <iframe
                    src={vimeo}
                    width="100%"
                    height="100%"
                    title="vimeo-player"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              )}
            </>
          )}
          {customizedTag.description && (
            <div className={styles.pArea}>
              {customizedTag.description.length >= 100 && (
                <p
                  className={styles.txtElePs}
                  dangerouslySetInnerHTML={{ __html: customizedTag.description }}
                />
              )}
              {customizedTag.description.length < 100 && (
                <p
                  className={styles.txtElePs}
                  dangerouslySetInnerHTML={{ __html: customizedTag.description }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const TagModal = memo(TagModalComp);
export default TagModal;
