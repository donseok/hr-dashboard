export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  departments: string[];
  locations: string[];
  employmentTypes: string[];
  customFilters: Record<string, string[]>;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multi-select' | 'date-range' | 'search';
  options?: FilterOption[];
  defaultValue?: string | string[];
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  displayValue: string;
}
