'use client';

import { useCallback } from 'react';
import { useDrilldownStore, type DrilldownLevel } from '@/stores/drilldownStore';

export function useDrilldown() {
  const { stack, isOpen, push, pop, reset, goToLevel, open, close } =
    useDrilldownStore();

  const drillDown = useCallback(
    (type: string, value: string, label: string) => {
      const currentLevel = stack.length > 0 ? stack[stack.length - 1] : null;
      push({
        id: `${type}-${value}`,
        label,
        type,
        value,
        parentId: currentLevel?.id,
      });
    },
    [stack, push],
  );

  const drillUp = useCallback(() => {
    if (stack.length > 0) pop();
  }, [stack, pop]);

  const currentLevel = stack.length > 0 ? stack[stack.length - 1] : null;
  const canDrillUp = stack.length > 0;
  const depth = stack.length;

  return {
    currentLevel,
    breadcrumbs: stack,
    canDrillUp,
    depth,
    isOpen,
    drillDown,
    drillUp,
    reset,
    goToLevel,
    open,
    close,
  };
}
