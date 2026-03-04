'use client';

import { useMemo } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import type { ActiveFilter } from '@/types/filter';

export function useFilterState() {
  const store = useFilterStore();

  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const filters: ActiveFilter[] = [];

    store.departments.forEach((dept) => {
      filters.push({
        key: 'departments',
        label: '부서',
        value: dept,
        displayValue: dept,
      });
    });

    store.locations.forEach((loc) => {
      filters.push({
        key: 'locations',
        label: '지역',
        value: loc,
        displayValue: loc,
      });
    });

    store.employmentTypes.forEach((type) => {
      filters.push({
        key: 'employmentTypes',
        label: '고용유형',
        value: type,
        displayValue: type,
      });
    });

    Object.entries(store.customFilters).forEach(([key, values]) => {
      values.forEach((val) => {
        filters.push({
          key: `custom.${key}`,
          label: key,
          value: val,
          displayValue: val,
        });
      });
    });

    return filters;
  }, [store.departments, store.locations, store.employmentTypes, store.customFilters]);

  const removeFilter = (filter: ActiveFilter) => {
    switch (filter.key) {
      case 'departments':
        store.removeDepartment(filter.value);
        break;
      case 'locations':
        store.setLocations(store.locations.filter((l) => l !== filter.value));
        break;
      case 'employmentTypes':
        store.setEmploymentTypes(
          store.employmentTypes.filter((t) => t !== filter.value),
        );
        break;
      default:
        if (filter.key.startsWith('custom.')) {
          const customKey = filter.key.replace('custom.', '');
          const current = store.customFilters[customKey] || [];
          store.setCustomFilter(
            customKey,
            current.filter((v) => v !== filter.value),
          );
        }
    }
  };

  return {
    ...store,
    activeFilters,
    removeFilter,
    filterCount: activeFilters.length,
  };
}
