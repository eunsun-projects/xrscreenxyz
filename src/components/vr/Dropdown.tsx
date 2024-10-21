import styles from '@/styles/dropdown.module.css';
import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import { useRef, useState } from 'react';
import { navigateToTag } from './lib/navigateToTag';

function Dropdown() {
  const { dropdownData } = useVrStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoPopup, setIsInfoPopup] = useState(false);
  const [tagSid, setTagSid] = useState('');
  const [activeMenu, setActiveMenu] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mpSdk } = useVrStore((state: VrStore) => ({
    mpSdk: state.mpSdk as MpSdk,
  }));

  const handleClickInfo = () => setIsInfoPopup((prev) => !prev);

  // 카테고리 없는 라벨 클릭
  const handleUnCateLabelClick = (id: string, index: number) => () => {
    setIsInfoPopup(!isInfoPopup);
    setTagSid(id);
    setActiveMenu(index);
    navigateToTag(mpSdk, id);
  };

  // style={{ filter : (isPopup || isInfoPopup) ? "blur(1px)" : "none"}}
  return (
    <>
      <div className={cn('w-full h-full bg-transparent')} />
      <div className={styles.dropdown_custom} ref={dropdownRef}>
        <div className={cn(styles.dropdown_content, isOpen ? 'block' : 'hidden')}>
          <div className={styles.menucontentInfo} onClick={handleClickInfo}>
            <div className={styles.listInfoIcon}>▶︎</div>
            <div className={styles.listLabel}>Information</div>
          </div>

          {dropdownData?.unCategorized?.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.menucontent} ${activeMenu === index ? styles.active : ''}`}
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
