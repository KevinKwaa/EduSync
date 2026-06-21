import { useState, useEffect } from 'react';

function prefersReduced() {
  return typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

export function useAnimateData(initial = true) {
  const [animateData, setAnimateData] = useState(initial);
  const [reducedMotion, setReducedMotion] = useState(prefersReduced);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return {
    shouldAnimate: animateData && !reducedMotion,
    animateData,
    setAnimateData,
    reducedMotion,
  };
}
