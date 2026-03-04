import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FilterState } from '@/types/filter';

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

interface FilterStore extends FilterState {
  setDateRange: (start: string, end: string) => void;
  setDepartments: (departments: string[]) => void;
  addDepartment: (department: string) => void;
  removeDepartment: (department: string) => void;
  setLocations: (locations: string[]) => void;
  setEmploymentTypes: (types: string[]) => void;
  setCustomFilter: (key: string, values: string[]) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const initialState: FilterState = {
  dateRange: getDefaultDateRange(),
  departments: [],
  locations: [],
  employmentTypes: [],
  customFilters: {},
};

export const useFilterStore = create<FilterStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setDateRange: (start, end) =>
        set({ dateRange: { start, end } }, false, 'setDateRange'),
      setDepartments: (departments) =>
        set({ departments }, false, 'setDepartments'),
      addDepartment: (department) =>
        set(
          (state) => ({
            departments: state.departments.includes(department)
              ? state.departments
              : [...state.departments, department],
          }),
          false,
          'addDepartment',
        ),
      removeDepartment: (department) =>
        set(
          (state) => ({
            departments: state.departments.filter((d) => d !== department),
          }),
          false,
          'removeDepartment',
        ),
      setLocations: (locations) =>
        set({ locations }, false, 'setLocations'),
      setEmploymentTypes: (types) =>
        set({ employmentTypes: types }, false, 'setEmploymentTypes'),
      setCustomFilter: (key, values) =>
        set(
          (state) => ({
            customFilters: { ...state.customFilters, [key]: values },
          }),
          false,
          'setCustomFilter',
        ),
      resetFilters: () => set(initialState, false, 'resetFilters'),
      hasActiveFilters: () => {
        const state = get();
        return (
          state.departments.length > 0 ||
          state.locations.length > 0 ||
          state.employmentTypes.length > 0 ||
          Object.values(state.customFilters).some((v) => v.length > 0)
        );
      },
    }),
    { name: 'filter-store' },
  ),
);
