import { createContext, useContext, useMemo, useState } from 'react';

export type VasInformInfo = { bool: boolean; info: any };

export type VasInformActions = {
  setTrue: (info: any) => void;
  setFalse: (info: any) => void;
};

export type VasInformContextType = [VasInformInfo, VasInformActions];

const VasInformContext = createContext<VasInformContextType | undefined>(undefined);

export function useInformState() {
  const value = useContext(VasInformContext);
  if (value === undefined) {
    throw new Error('useInformState should be used within InformProvider');
  }
  return value;
}

export function VasInformProvider({ children }: { children: React.ReactNode }) {
  // 초기 상태를 null이나 적절한 초기값으로 설정할 수 있습니다.
  const [isInfo, setTrueFalse] = useState({ bool: false, info: null });

  const boolActions = useMemo(
    () => ({
      setTrue(info: any) {
        setTrueFalse((prev) => ({
          ...prev,
          bool: true,
          info,
        }));
      },
      setFalse(info: any) {
        setTrueFalse((prev) => ({
          ...prev,
          bool: false,
          info,
        }));
      },
    }),
    [],
  );

  const value = useMemo(() => [isInfo, boolActions] as VasInformContextType, [isInfo, boolActions]);

  return <VasInformContext.Provider value={value}>{children}</VasInformContext.Provider>;
}
