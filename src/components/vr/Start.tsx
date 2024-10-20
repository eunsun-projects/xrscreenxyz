'use client';

import { cn } from '@/utils/common';
import useVrStore, { VrStore } from '@/zustand/vr.store';
import { useShallow } from 'zustand/shallow';
import EnterLoader from '../loaders/EnterLoader';

const mouseHelpText =
  '마우스 휠을 통해 줌 인 줌 아웃이 가능합니다.\n마우스 드래그를 통해 공간을 둘러볼 수 있습니다.';
const keyboardHelpText = '키보드 방향키를 통해 위치를 이동할 수 있습니다.';

interface StartProps {
  title: string;
}

function Start({ title }: StartProps) {
  const { embed, isWebCompReady, setIsWebCompReady } = useVrStore(
    useShallow((state: VrStore) => ({
      embed: state.embed,
      isWebCompReady: state.isWebCompReady,
      setIsWebCompReady: state.setIsWebCompReady,
    })),
  );

  const handleStart = () => {
    if (embed && window.parent) {
      window.open(window.location.href);
    } else {
      setIsWebCompReady(false);
    }
  };

  return (
    <div className="absolute w-dvw h-dvh m-0 p-0 overflow-hidden touch-none z-10 transition-opacity ">
      <div className="h-full w-full duration-100 bg-gray-600">
        <div className="text-center text-white text-4xl font-bold mx-auto break-keep">{title}</div>
        <div className="text-center h-full w-full select-none pointer-events-none">
          <div className={cn(embed.isEmbedMiddle ? 'h-[70%]' : 'h-[60%]')}>
            <div
              className={cn(
                embed.isEmbed ? 'hidden' : 'flex',
                embed.isEmbedMiddle ? 'h-[50%]' : 'h-[80%]',
                'flex-col',
              )}
            >
              <div className="relative w-full h-full flex flex-col justify-end">
                <div className="w-full h-full flex justify-end items-end">
                  <div className="opacity-80 w-[63%] h-[80%] bg-contain bg-no-repeat bg-center bg-[url(/assets/svgs/Mouse.svg)]" />
                </div>
                <div className="w-full h-full flex justify-end">
                  <div className="w-[60%] h-full flex items-center text-center">
                    <p className="w-full text-white whitespace-pre-line leading-5">
                      {mouseHelpText}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full h-full flex flex-col">
                <div className="w-[60%] h-full flex items-end">
                  <div className="opacity-80 w-full h-[50%] bg-contain bg-no-repeat bg-center bg-[url(/assets/svgs/Keyboard.svg)]"></div>
                </div>
                <div className="w-full h-full flex">
                  <div className="w-[60%] h-full flex items-center text-center">
                    <p className="w-full text-white whitespace-pre-line leading-5">
                      {keyboardHelpText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[10%] pt-[1.5rem] flex flex-col justify-center items-center">
              <EnterLoader isReady={isWebCompReady} />

              <div
                className={cn(
                  'absolute flex justify-center items-center text-shadow-white text-white w-[7rem] h-[3rem] bg-white/30 transition-all duration-1000 cursor-pointer z-50 text-[1.2rem]',
                  isWebCompReady ? 'pointer-events-auto' : 'pointer-events-none',
                  isWebCompReady ? 'opacity-100' : 'opacity-0',
                  embed.isEmbedMiddle ? 'text-[1.5rem] w-[6rem] h-[2.5rem]' : 'text-[1rem]',
                  embed.isEmbed ? 'w-[5rem] h-[2rem]' : 'w-[7rem]',
                )}
                onClick={handleStart}
              >
                <p>enter</p>
              </div>
            </div>
            {/* { mpModels.downLogo[0] && !embed && ( <div className={styles.basic_logo} style={{ backgroundImage : `url('${mpModels.lowLogoUrl}')`, backgroundSize : 'contain', backgroundRepeat : "no-repeat", backgroundPosition :"center"}}></div> )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
