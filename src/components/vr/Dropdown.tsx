import styles from '@/styles/dropdown.module.css';
import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import Script from 'next/script';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { FaHeadphones } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useShallow } from 'zustand/shallow';
import { VrModel } from '../types/vr.type';
import InfoModal from './InfoModal';
import { navigateToTag } from './lib/navigateToTag';
import TagModal from './TagModal';

interface DropdownProps {
  model: VrModel;
}
function DropdownComp({ model }: DropdownProps) {
  const { dropdownData, mpSdk, modelInfo, audioRef, viewer, modalState, setModalState } =
    useVrStore(
      useShallow((state: VrStore) => ({
        audioRef: state.audioRef,
        dropdownData: state.dropdownData,
        mpSdk: state.mpSdk as MpSdk,
        modelInfo: state.modelInfo,
        viewer: state.viewer,
        modalState: state.modalState,
        setModalState: state.setModalState,
      })),
    );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [scrollHeight, setScrollHeight] = useState<Record<number, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<Record<string | 'info', boolean>>(() => ({
    info: false,
    ...(dropdownData?.categorized?.reduce(
      (acc, item) => {
        acc[item.id] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    ) ?? {}),
  }));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownOpen = () => setIsDropdownOpen((prev) => !prev);
  // 정보 모달 클릭
  const handleInfoClick = () => {
    setSelectedLabel({ info: true });
    setModalState({ type: 'info', isOpen: !modalState.isOpen, selectedTag: null });
  };
  // 음악 드롭다운 클릭
  const handleMusicOpen = () => setIsMusicOpen((prev) => !prev);

  // 카테고리 없는 라벨 클릭
  const handleUnCategorizedLabelClick = (id: string) => () => {
    setModalState({
      type: 'tag',
      isOpen: !modalState.isOpen,
      selectedTag: dropdownData?.merged?.find((item) => item.id === id) ?? null,
    });
    setSelectedLabel((prev) => ({ info: false, [id]: !prev[id] }));
    navigateToTag(mpSdk, id);
  };

  // 카테고리 있는 메뉴 클릭
  const handleCategorizedMenuClick =
    (index: number, title: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      setSelectedCategory((prev) => (prev === title ? '' : title));
      const content = e.currentTarget.nextElementSibling;
      const scroll = content?.scrollHeight + 'px';
      setScrollHeight((prev) => ({
        ...prev,
        [index]: selectedCategory.includes(title) ? '0' : scroll,
      }));
    };

  // 카테고리 있는 라벨 클릭
  const handleCategorizedLabelClick = (id: string) => () => {
    setSelectedLabel((prev) => ({ info: false, [id]: !prev[id] }));
    setModalState({
      type: 'tag',
      isOpen: !modalState.isOpen,
      selectedTag: dropdownData?.merged?.find((item) => item.id === id) ?? null,
    });
    navigateToTag(mpSdk, id);
  };

  useEffect(() => {
    if (!viewer || !mpSdk) return;
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModalState({ type: null, isOpen: false, selectedTag: null });
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
  }, [viewer, mpSdk, setModalState]);

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      {modalState.isOpen && modalState.type === 'info' && modelInfo && (
        <InfoModal modelInfo={modelInfo} logoUrl={model.logo[1] as string} />
      )}
      {modalState.isOpen && modalState.type === 'tag' && modalState.selectedTag && (
        <TagModal
          tag={modalState.selectedTag}
          mpSdk={mpSdk}
          attachs={dropdownData?.customizedAttachs ?? []}
        />
      )}
      <div
        className={cn(
          'absolute top-0 left-0 w-full h-full bg-transparent z-10 touch-none pointer-events-none',
          modalState.isOpen ? 'backdrop-blur-[1px]' : '',
        )}
      />
      <div className={styles.dropdown_custom} ref={dropdownRef}>
        {modelInfo && (
          <div className="flex flex-row p-[1vh]">
            <button
              className={cn(model.bgm[0] ? 'basis-[80%]' : 'basis-[90%]', 'text-white')}
              onClick={handleDropdownOpen}
            >
              <span>{modelInfo.name}</span>
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
          </div>
        )}

        <div className={cn(isDropdownOpen ? styles.show : '', styles.dropdown_content)}>
          <div
            className={`${styles.menucontentInfo} ${selectedLabel.info ? styles.active : ''}`}
            onClick={handleInfoClick}
          >
            <div className={styles.listInfoIcon}>▶︎</div>
            <div className={styles.listLabel}>Information</div>
          </div>

          {dropdownData?.unCategorized?.map((tag, index) => (
            <div
              key={tag.id}
              className={`${styles.menucontent} ${selectedLabel[index] ? styles.active : ''}`}
              onClick={handleUnCategorizedLabelClick(tag.id)}
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
              <button className={styles.collap} onClick={handleCategorizedMenuClick(index, title)}>
                <span>{title}</span>
              </button>
              <div
                className={`${styles.innerWrapper} ${selectedCategory === title ? styles.active : ''}`}
                style={{
                  maxHeight: selectedCategory === title ? scrollHeight[index] : '0',
                }}
              >
                {dropdownData?.categorized
                  ?.filter((tag) => tag.sorted?.[1] === title)
                  .map((tag, index) => (
                    <div
                      key={tag.id}
                      className={`${styles.menucontent} ${selectedLabel[index] ? styles.active : ''}`}
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
