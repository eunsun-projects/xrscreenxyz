import { createContext, useContext, useMemo, useState } from 'react';

export type VasLoadingActions = {
  increase: () => void;
  decrease: () => void;
};

export type VasLoadingContextType = [number, VasLoadingActions];

export const VasLoadingContext = createContext<VasLoadingContextType>([
  0,
  { increase: () => {}, decrease: () => {} },
]);

export function useLoadingCounter() {
  const value = useContext(VasLoadingContext);
  if (value === undefined) {
    throw new Error('useLoadingCounterState should be used within LoadingProvider');
  }
  return value;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [counter, setCounter] = useState(0);
  const actions = useMemo(
    () => ({
      increase() {
        setCounter((prev) => prev + 1);
      },
      decrease() {
        setCounter((prev) => prev - 1);
      },
    }),
    [],
  );

  const value: VasLoadingContextType = useMemo(() => [counter, actions], [counter, actions]);

  return <VasLoadingContext.Provider value={value}>{children}</VasLoadingContext.Provider>;
}
