'use client';

import { useInformState } from '@/context/vasInform.context';
import { useLoadingCounter } from '@/context/vasLoading.context';
import { sanctumLights, sanctumModels, sanctumTextures } from '@/data/sanctum.data';
import { vasLights, vasTextures } from '@/data/vas.data';
import styles from '@/styles/vas.module.css';
import { JoystickManagerOptions } from 'nipplejs';
import { useEffect, useRef, useState } from 'react';
import VasCaption from './VasCaption';
import VasKeyarrow from './VasKeyArrow';
import Sanctum from './class/sanctum.class';
import Vas from './class/vas.class';

interface VasCanvasProps {
  title: string;
  mobile: boolean;
  enter: boolean;
}

export default function VasCanvas({ title, mobile, enter }: VasCanvasProps) {
  const [vasApp, setVasApp] = useState<Vas | Sanctum | null>(null);
  const [nipplejs, setNipplejs] = useState<typeof import('nipplejs') | null>(null);
  const [options, setOptions] = useState<JoystickManagerOptions | null>(null);
  const [counter, actions] = useLoadingCounter();
  const [isInfo, boolActions] = useInformState();

  const canvasDivRef = useRef<HTMLDivElement>(null);
  const joysticRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let app: any;
    if (!canvasDivRef.current) return;
    if (title === 'sanctum') {
      app = new Sanctum(
        canvasDivRef.current,
        title,
        actions,
        boolActions,
        sanctumTextures,
        [],
        sanctumModels,
        sanctumLights,
      );
      setVasApp(app);
    } else {
      app = new Vas(
        canvasDivRef.current,
        title,
        actions,
        boolActions,
        vasTextures,
        [],
        [],
        vasLights,
      );
      setVasApp(app);
    }

    // 초기화 및 설정 메소드 호출
    // vasApp.init(); // 초기화는 인스턴스 안에서
    app.addWorldLight(); // 빛 추가 시작
    app.addWallFloorCeiling(); // 벽 바닥 천장 추가 시작
    app.addModelAndLight(); // 모델 및 빛 추가 (있을경우) 시작
    app.addPaintings(); // 2d 작품 추가 (있을경우) 시작
    app.addPedestal(); // 좌대 추가 (true 인경우) 시작
    app.rotate(); // 화면 회전 기능 추가 시작
    app.onKeydownUp(); // 키보드로 이동기능 추가 시작

    // 이벤트 핸들러 등록
    window.onresize = app.resize.bind(app);
    // 초기 사이즈 조정
    app.resize();

    // 렌더링 루프 시작
    function animate() {
      app.render(); // 실제 렌더링 함수
      raf.current = requestAnimationFrame(animate);
    }
    animate();

    // 클린업 함수
    return () => {
      app.destroy();
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
      window.onresize = null;
    };
  }, []);

  useEffect(() => {
    if (mobile) {
      const options = {
        zone: joysticRef.current,
        mode: 'static',
        position: { right: '50%', bottom: '50%' },
        size: 70,
      } as JoystickManagerOptions;
      const nipplejs = require('nipplejs');
      setNipplejs(nipplejs);
      setOptions(options);
    }
  }, [mobile]);

  useEffect(() => {
    if (!vasApp) return;
    if (!mobile) return;
    if (!nipplejs || !options) return;
    const manager = nipplejs.create(options);

    manager.on('move', (event, data) => {
      if (data.direction && data.angle.radian) {
        const radian = data.angle.radian; // radian 판단
        if (!vasApp.checkCollision()) {
          // 충돌 상태가 아닐 때만 움직임을 처리
          if (radian < 0.524 || radian > 5.756) {
            // right
            vasApp.controls.w = false;
            vasApp.controls.a = false;
            vasApp.controls.s = false;
            vasApp.controls.d = true;
          } else if (radian < 1.046 && radian > 0.524) {
            // right up
            vasApp.controls.w = true;
            vasApp.controls.a = false;
            vasApp.controls.s = false;
            vasApp.controls.d = true;
          } else if (radian < 2.092 && radian > 1.046) {
            // up
            vasApp.controls.w = true;
            vasApp.controls.a = false;
            vasApp.controls.s = false;
            vasApp.controls.d = false;
          } else if (radian < 2.615 && radian > 2.092) {
            // left up
            vasApp.controls.w = true;
            vasApp.controls.a = true;
            vasApp.controls.s = false;
            vasApp.controls.d = false;
          } else if (radian < 3.662 && radian > 2.615) {
            // left
            vasApp.controls.w = false;
            vasApp.controls.a = true;
            vasApp.controls.s = false;
            vasApp.controls.d = false;
          } else if (radian < 4.186 && radian > 3.662) {
            // left down
            vasApp.controls.w = false;
            vasApp.controls.a = true;
            vasApp.controls.s = true;
            vasApp.controls.d = false;
          } else if (radian < 5.233 && radian > 4.186) {
            // down
            vasApp.controls.w = false;
            vasApp.controls.a = false;
            vasApp.controls.s = true;
            vasApp.controls.d = false;
          } else if (radian < 5.756 && radian > 5.233) {
            // down right
            vasApp.controls.w = false;
            vasApp.controls.a = false;
            vasApp.controls.s = true;
            vasApp.controls.d = true;
          }
        }
      }
    });

    manager.on('end', () => {
      // console.log('end')
      vasApp.controls.w = false;
      vasApp.controls.a = false;
      vasApp.controls.s = false;
      vasApp.controls.d = false;
    });

    // 컴포넌트가 unmount될 때 이벤트 리스너와 객체를 정리합니다.
    return () => {
      if (manager) manager.destroy();
    };
  }, [vasApp, nipplejs, mobile, options]);

  useEffect(() => {
    if (counter > 0) {
      console.log(counter);
    }
  }, [counter]);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
          display: mobile ? 'block' : 'none',
        }}
      >
        <div
          ref={joysticRef}
          style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            right: '1%',
            bottom: '4%',
            zIndex: '100',
            pointerEvents: enter ? 'all' : 'none',
          }}
        ></div>
      </div>

      <div className={styles.canvastop} ref={canvasDivRef}></div>

      {vasApp && <VasKeyarrow vas={vasApp} mobile={mobile} />}
      {isInfo.bool && <VasCaption bool={isInfo.bool} info={isInfo.info} />}
    </>
  );
}
