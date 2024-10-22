import styles from '@/styles/dropdown.module.css';
import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import Script from 'next/script';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { FaHeadphones } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useShallow } from 'zustand/shallow';
import { ModalState, VrModel } from '../types/vr.type';
import PopupInfoModal from './InfoModal';
import { navigateToTag } from './lib/navigateToTag';

interface DropdownProps {
  model: VrModel;
}
function DropdownComp({ model }: DropdownProps) {
  const { dropdownData, mpSdk, modelInfo, audioRef, viewer } = useVrStore(
    useShallow((state: VrStore) => ({
      audioRef: state.audioRef,
      dropdownData: state.dropdownData,
      mpSdk: state.mpSdk as MpSdk,
      modelInfo: state.modelInfo,
      viewer: state.viewer,
    })),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    selectedTag: null,
  });
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [scrollHeight, setScrollHeight] = useState<Record<number, string>>({});
  const [activeUnCategorized, setActiveUncategorized] = useState<Record<number, boolean>>(
    dropdownData?.unCategorized?.reduce((acc: Record<number, boolean>, _, index) => {
      acc[index] = false;
      return acc;
    }, {}) ?? {},
  );
  const [activeCategorized, setActiveCategorized] = useState<Record<number, boolean>>(
    dropdownData?.categorized?.reduce((acc: Record<number, boolean>, _, index) => {
      acc[index] = false;
      return acc;
    }, {}) ?? {},
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownOpen = () => setIsDropdownOpen((prev) => !prev);
  // 정보 모달 클릭
  const handleClickInfo = () =>
    setModalState((prev) => ({ ...prev, type: 'info', isOpen: !prev.isOpen, selectedTag: null }));
  // 음악 드롭다운 클릭
  const handleMusicOpen = () => setIsMusicOpen((prev) => !prev);

  // 카테고리 없는 라벨 클릭
  const handleUnCategorizedLabelClick = (id: string, index: number) => () => {
    setModalState((prev) => ({
      ...prev,
      type: 'tag',
      isOpen: !prev.isOpen,
      selectedTag: dropdownData?.merged?.find((item) => item.id === id) ?? null,
    }));
    setActiveUncategorized((prev) => ({ ...prev, [index]: !prev[index] }));
    navigateToTag(mpSdk, id);
  };

  // 카테고리 있는 메뉴 클릭
  const handleCategorizedMenuClick =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      const content = e.currentTarget.nextElementSibling;
      const scroll = content?.scrollHeight + 'px';
      setScrollHeight((prev) => ({ ...prev, [index]: activeCategorized[index] ? '0' : scroll }));
      setActiveCategorized((prev) => ({ ...prev, [index]: !prev[index] }));
    };

  // 카테고리 있는 라벨 클릭
  const handleCategorizedLabelClick = (id: string) => () => {
    setModalState((prev) => ({
      ...prev,
      type: 'tag',
      isOpen: !prev.isOpen,
      selectedTag: dropdownData?.merged?.find((item) => item.id === id) ?? null,
    }));
    navigateToTag(mpSdk, id);
  };

  useEffect(() => {
    if (!viewer || !mpSdk) return;
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModalState((prev) => ({ ...prev, type: null, isOpen: false, selectedTag: null }));
        mpSdk.Camera.zoomReset();
        mpSdk.Camera.rotate(1, 1);
      }
    };
    const innerIframe = viewer.shadowRoot?.querySelector('.matterport-webcomponent');
    if (innerIframe) {
      innerIframe.addEventListener('mousedown', handleClickOutside);
      innerIframe.addEventListener('touchstart', handleClickOutside);
      return () => {
        innerIframe.removeEventListener('mousedown', handleClickOutside);
        innerIframe.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [viewer, mpSdk]);

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      {modalState.isOpen && modalState.type === 'info' && modelInfo && (
        <PopupInfoModal
          modelInfo={modelInfo}
          logoUrl={model.logo[1] as string}
          setModalState={setModalState}
        />
      )}
      <div className={cn('w-full h-full bg-transparent', modalState.isOpen ? 'blur-[1px]' : '')} />
      <div className={styles.dropdown_custom} ref={dropdownRef}>
        {modelInfo && (
          <>
            <button>
              <span
                className={cn(model.bgm[0] ? 'basis-[80%]' : 'basis-[90%]')}
                onClick={handleDropdownOpen}
              >
                {modelInfo.name}
              </span>
            </button>
            {model.bgm[0] && (
              <button>
                <FaHeadphones
                  className={cn(
                    'h-6 w-6',
                    !audioRef?.current?.paused || isMusicOpen ? 'text-selected' : 'text-white',
                  )}
                  onClick={handleMusicOpen}
                />
              </button>
            )}
            <button>
              <IoMdArrowDropdown
                className="text-white h-6 w-6 float-right basis-[10%] hover:cursor-pointer hover:text-white"
                onClick={handleDropdownOpen}
              />
            </button>
          </>
        )}

        <div className={cn(styles.dropdown_content, isDropdownOpen ? 'block' : 'hidden')}>
          <div className={styles.menucontentInfo} onClick={handleClickInfo}>
            <div className={styles.listInfoIcon}>▶︎</div>
            <div className={styles.listLabel}>Information</div>
          </div>

          {dropdownData?.unCategorized?.map((tag, index) => (
            <div
              key={tag.id}
              className={`${styles.menucontent} ${activeUnCategorized[index] ? styles.active : ''}`}
              onClick={handleUnCategorizedLabelClick(tag.id, index)}
            >
              <div
                className={styles.listIcon}
                style={{
                  backgroundColor: `rgb(${tag.color.r * 255}, ${tag.color.g * 255}, ${tag.color.b * 255})`,
                }}
              />
              <div className={styles.listLabel}>{tag.label}</div>
            </div>
          ))}

          {dropdownData?.unique?.map((title, index) => (
            <Fragment key={title + index}>
              <button
                className={`${styles.collap} ${activeCategorized[index] && styles.active2}`}
                onClick={handleCategorizedMenuClick(index)}
              >
                <span>{title}</span>
              </button>
              <div
                className={styles.innerWrapper}
                style={{
                  maxHeight: activeCategorized[index] ? scrollHeight[index] : '0',
                }}
              >
                {dropdownData?.categorized
                  ?.filter((tag) => tag.sorted?.[1] === title)
                  .map((tag) => (
                    <div
                      key={tag.id}
                      className={styles.menucontent}
                      onClick={handleCategorizedLabelClick(tag.id)}
                    >
                      <div
                        className={styles.listIcon}
                        style={{
                          backgroundColor: `rgb(${tag.color.r * 255}, ${tag.color.g * 255}, ${tag.color.b * 255})`,
                        }}
                      />
                      <div className={styles.listLabel}>{tag.label}</div>
                    </div>
                  ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
const Dropdown = memo(DropdownComp);
export default Dropdown;
