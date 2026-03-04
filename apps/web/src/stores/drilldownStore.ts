import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DrilldownLevel {
  id: string;
  label: string;
  type: string;
  value: string;
  parentId?: string;
}

interface DrilldownStore {
  stack: DrilldownLevel[];
  isOpen: boolean;
  push: (level: DrilldownLevel) => void;
  pop: () => void;
  reset: () => void;
  goToLevel: (index: number) => void;
  open: () => void;
  close: () => void;
  currentLevel: () => DrilldownLevel | null;
  breadcrumbs: () => DrilldownLevel[];
}

export const useDrilldownStore = create<DrilldownStore>()(
  devtools(
    (set, get) => ({
      stack: [],
      isOpen: false,
      push: (level) =>
        set(
          (state) => ({ stack: [...state.stack, level], isOpen: true }),
          false,
          'drilldown/push',
        ),
      pop: () =>
        set(
          (state) => ({
            stack: state.stack.slice(0, -1),
            isOpen: state.stack.length > 1,
          }),
          false,
          'drilldown/pop',
        ),
      reset: () => set({ stack: [], isOpen: false }, false, 'drilldown/reset'),
      goToLevel: (index) =>
        set(
          (state) => ({
            stack: state.stack.slice(0, index + 1),
          }),
          false,
          'drilldown/goToLevel',
        ),
      open: () => set({ isOpen: true }, false, 'drilldown/open'),
      close: () => set({ isOpen: false }, false, 'drilldown/close'),
      currentLevel: () => {
        const { stack } = get();
        return stack.length > 0 ? stack[stack.length - 1] : null;
      },
      breadcrumbs: () => get().stack,
    }),
    { name: 'drilldown-store' },
  ),
);
