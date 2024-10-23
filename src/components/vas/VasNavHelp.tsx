'use client';

import styles from '@/styles/vas.module.css';
import Link from 'next/link';
import { useState } from 'react';
import VasCanvas from './VasCanvas';
import VasIntro from './VasIntro';

interface VasNavHelpProps {
  title: string;
  mobile: boolean | null;
}

export default function VasNavHelp({ title, mobile }: VasNavHelpProps) {
  const [enter, setEnter] = useState(false);

  const handlePause = () => {
    setEnter(false);
  };

  return (
    <>
      <div className={styles.vastopnav}>
        <div className={styles.topnavbox} onClick={handlePause}>
          <span className={styles.materialicons}>pause</span>
        </div>
        <Link href={'/vas'} style={{ color: 'white' }}>
          <div className={styles.topnavbox}>
            <span className={styles.materialicons}>close</span>
          </div>
        </Link>
        <Link href={'/'} style={{ color: 'white' }}>
          <div className={styles.topnavbox}>
            <span className={styles.materialicons}>home</span>
          </div>
        </Link>
      </div>

      {!enter && <VasIntro title={title} setEnter={setEnter} />}

      <div className={styles.worksinfo}></div>

      {!enter && <div className={styles.filtered}></div>}

      {mobile !== null && <VasCanvas title={title} mobile={mobile} enter={enter} />}
    </>
  );
}
