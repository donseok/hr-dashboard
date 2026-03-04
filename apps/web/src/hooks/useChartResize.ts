'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { ECharts } from 'echarts';

export function useChartResize(chartInstance: ECharts | null) {
  const rafRef = useRef<number | null>(null);

  const handleResize = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      chartInstance?.resize({ animation: { duration: 200 } });
    });
  }, [chartInstance]);

  useEffect(() => {
    if (!chartInstance) return;

    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);

    const container = chartInstance.getDom();
    if (container?.parentElement) {
      observer.observe(container.parentElement);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [chartInstance, handleResize]);

  return { resize: handleResize };
}
