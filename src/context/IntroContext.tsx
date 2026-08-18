import React, { createContext, useContext, useMemo, useState } from 'react';

export type IntroPhase = 'playing' | 'revealing' | 'done';

interface IntroContextValue {
  phase: IntroPhase;
  beginReveal: () => void;
  complete: () => void;
  skip: () => void;
}

const IntroContext = createContext<IntroContextValue>({
  phase: 'done',
  beginReveal: () => {},
  complete: () => {},
  skip: () => {},
});

export const useIntro = () => useContext(IntroContext);

function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<IntroPhase>(() => (shouldPlayIntro() ? 'playing' : 'done'));

  const value = useMemo<IntroContextValue>(
    () => ({
      phase,
      beginReveal: () => setPhase((current) => (current === 'playing' ? 'revealing' : current)),
      complete: () => setPhase('done'),
      skip: () => setPhase('done'),
    }),
    [phase]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
};
