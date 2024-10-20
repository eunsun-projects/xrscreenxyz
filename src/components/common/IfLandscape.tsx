'use client';

import { useEffect, useState } from 'react';

function IfLandscape() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = () => {
        return /Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }; // =========> mobile device check function

      if (isMobile() && window.matchMedia('(orientation: portrait)').matches) {
        setIsMobile(false);
      } else if (isMobile() && window.matchMedia('(orientation: landscape)').matches) {
        setIsMobile(true);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isMobile && (
        <div className="bg-screen-blue text-screen-green text-shadow-screen text-[1.2rem] font-dunggeunmo fixed top-0 left-0 w-dvw h-dvh z-10 flex flex-col items-center justify-center">
          <p>◐◐</p>
          <p>looks good in portrait mode</p>
          <p>세로모드에서 잘 보여요</p>
        </div>
      )}
    </div>
  );
}

export default IfLandscape;
