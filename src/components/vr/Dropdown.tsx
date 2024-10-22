import styles from '@/styles/dropdown.module.css';
import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import { useRef, useState } from 'react';
import { FaHeadphones } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useShallow } from 'zustand/shallow';
import { VrModel } from '../types/vr.type';
import { navigateToTag } from './lib/navigateToTag';

interface DropdownProps {
  model: VrModel;
}

function Dropdown({ model }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [active, setActive] = useState({
    index: 0,
    tagSid: '',
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dropdownData, mpSdk, modelInfo, audioRef } = useVrStore(
    useShallow((state: VrStore) => ({
      audioRef: state.audioRef,
      dropdownData: state.dropdownData,
      mpSdk: state.mpSdk as MpSdk,
      modelInfo: state.modelInfo,
    })),
  );

  const handleClickInfo = () => setIsInfoOpen((prev) => !prev);

  const handleDropdownOpen = () => setIsOpen((prev) => !prev);

  const handleMusicOpen = () => setIsMusicOpen((prev) => !prev);

  // 카테고리 없는 라벨 클릭
  const handleUnCateLabelClick = (id: string, index: number) => () => {
    setIsInfoOpen(!isInfoOpen);
    setActive({
      index,
      tagSid: id,
    });
    navigateToTag(mpSdk, id);
  };

  // style={{ filter : (isPopup || isInfoPopup) ? "blur(1px)" : "none"}}
  return (
    <>
      <div className={cn('w-full h-full bg-transparent')} />
      <div className={styles.dropdown_custom} ref={dropdownRef}>
        <div className={cn(styles.dropdown_content, isOpen ? 'block' : 'hidden')}>
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

          <div className={styles.menucontentInfo} onClick={handleClickInfo}>
            <div className={styles.listInfoIcon}>▶︎</div>
            <div className={styles.listLabel}>Information</div>
          </div>

          {dropdownData?.unCategorized?.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.menucontent} ${active.index === index ? styles.active : ''}`}
              onClick={handleUnCateLabelClick(item.id, index)}
            >
              <div
                className={styles.listIcon}
                style={{
                  backgroundColor: `rgb(${item.color.r * 255}, ${item.color.g * 255}, ${item.color.b * 255})`,
                }}
              />
              <div className={styles.listLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dropdown;
