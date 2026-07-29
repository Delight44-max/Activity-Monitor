'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/src/lib/utils';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  className,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    countRef.current = 0;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.floor(easeOut * end);
      setCount(countRef.current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}