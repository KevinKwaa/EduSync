import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, { format = String, enabled = true, duration = 950 } = {}) {
  const [display, setDisplay] = useState(enabled ? format(0) : format(target));
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setDisplay(format(target));
      return;
    }

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    startRef.current = null;

    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(format(target * eased));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(format(target));
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, enabled, duration]);

  return display;
}
