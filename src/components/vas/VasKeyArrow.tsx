'use client';

import styles from '@/styles/vas.module.css';

export default function VasKeyarrow({ vas, mobile }: { vas: any; mobile: boolean }) {
  const handleDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    vas.onMoveKeyDown(target.dataset.arrow);
  };

  const handleUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    vas.onMoveKeyUp(target.dataset.arrow);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    vas.onMoveKeyDown(target.dataset.arrow);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    vas.onMoveKeyUp(target.dataset.arrow);
  };

  return (
    <div
      className={styles.vaskeys}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.vasarr}
        style={{ position: 'relative', top: '-4px', display: mobile ? 'none' : 'flex' }}
        data-arrow="ArrowUp"
      >
        <span className={styles.materialicons} data-arrow="ArrowUp">
          arrow_upward
        </span>
      </div>

      <div className={styles.vaskeybelow} style={{ display: mobile ? 'none' : 'flex' }}>
        <div className={styles.vasarr} data-arrow="ArrowLeft">
          <span className={styles.materialicons} data-arrow="ArrowLeft">
            arrow_back
          </span>
        </div>
        <div className={styles.vasarr} data-arrow="ArrowDown">
          <span className={styles.materialicons} data-arrow="ArrowDown">
            arrow_downward
          </span>
        </div>
        <div className={styles.vasarr} data-arrow="ArrowRight">
          <span className={styles.materialicons} data-arrow="ArrowRight">
            arrow_forward
          </span>
        </div>
      </div>

      <div
        className={`${styles.vasarr} ${styles.xyzspace}`}
        style={{ width: mobile ? '70px' : '96%', height: '12px', marginTop: '6px' }}
        data-arrow="space"
      ></div>
    </div>
  );
}
