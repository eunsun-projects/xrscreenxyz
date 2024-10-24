/* eslint-disable @next/next/no-img-element */
'use client';

import styles from '@/styles/dropdown.module.css';
import { phoneMiddle3, phoneMiddle4 } from '@/utils/common';
import useVrStore from '@/zustand/vr.store';
import { memo, useMemo } from 'react';
import { Model } from '../../../public/matterport-assets/sdk';

interface InfoModalProps {
  modelInfo: Model.ModelDetails;
  logoUrl: string | null;
}

function InfoModalComp({ modelInfo, logoUrl }: InfoModalProps) {
  const { setModalState } = useVrStore();
  const handleExit = () => setModalState({ type: null, isOpen: false, selectedTag: null });

  const phone = useMemo(() => {
    const originPhoneNumber = modelInfo.phone?.replace(/\+1/, ''); // 메타포트 디테일 입력시 전화번호 앞에 +1 붙일것
    let changedPhoneNumber;
    if (originPhoneNumber?.length === 12) {
      changedPhoneNumber = originPhoneNumber?.replace(phoneMiddle4, '$1-$2-$3');
    } else {
      changedPhoneNumber = originPhoneNumber?.replace(phoneMiddle3, '$1-$2-$3');
    }
    if (changedPhoneNumber) {
      return changedPhoneNumber;
    }
  }, [modelInfo]);

  return (
    <>
      <div className={styles.popup_overlay}>
        <div className={styles.popup_exit} onClick={handleExit}>
          x
        </div>
        <div className={styles.txtArea}>
          <div className={styles.txtTitleArea}>
            <h2 className={styles.txtEleT}>{modelInfo.name}</h2>
          </div>
          {logoUrl && (
            <div className={styles.imgArea}>
              <img src={logoUrl} style={{ cursor: 'default' }} alt="thumbnail images" />
            </div>
          )}

          {modelInfo.summary && (
            <div className={styles.pArea}>
              <p
                className={styles.txtEleP}
                dangerouslySetInnerHTML={{ __html: modelInfo.summary }}
              />
            </div>
          )}

          {modelInfo.contactName && (
            <div className={styles.pArea}>
              <p className={styles.txtEleP}>{modelInfo.contactName}</p>
            </div>
          )}

          {modelInfo.contactEmail && (
            <div className={styles.pArea}>
              <p className={styles.txtEleP}>{modelInfo.contactEmail}</p>
            </div>
          )}

          {phone && (
            <div className={styles.pArea}>
              <p className={styles.txtEleP}>{phone}</p>
            </div>
          )}

          {modelInfo.formattedAddress && (
            <div className={styles.pArea}>
              <p className={styles.txtEleP}>{modelInfo.formattedAddress}</p>
            </div>
          )}

          {modelInfo.shareUrl && (
            <div className={styles.pArea}>
              <p className={styles.txtEleP}>{modelInfo.shareUrl}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
const InfoModal = memo(InfoModalComp);
export default InfoModal;
