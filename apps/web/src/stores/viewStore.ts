import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'list' | 'compact';
type SidebarState = 'expanded' | 'collapsed';

interface ViewStore {
  viewMode: ViewMode;
  sidebarState: SidebarState;
  activeModule: string | null;
  isFilterPanelOpen: boolean;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
  setActiveModule: (moduleId: string | null) => void;
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (open: boolean) => void;
}

export const useViewStore = create<ViewStore>()(
  devtools(
    persist(
      (set) => ({
        viewMode: 'grid',
        sidebarState: 'expanded',
        activeModule: null,
        isFilterPanelOpen: false,
        setViewMode: (viewMode) => set({ viewMode }, false, 'setViewMode'),
        toggleSidebar: () =>
          set(
            (state) => ({
              sidebarState:
                state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
            }),
            false,
            'toggleSidebar',
          ),
        setSidebarState: (sidebarState) =>
          set({ sidebarState }, false, 'setSidebarState'),
        setActiveModule: (activeModule) =>
          set({ activeModule }, false, 'setActiveModule'),
        toggleFilterPanel: () =>
          set(
            (state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen }),
            false,
            'toggleFilterPanel',
          ),
        setFilterPanelOpen: (isFilterPanelOpen) =>
          set({ isFilterPanelOpen }, false, 'setFilterPanelOpen'),
      }),
      { name: 'view-store' },
    ),
    { name: 'view-store' },
  ),
);
