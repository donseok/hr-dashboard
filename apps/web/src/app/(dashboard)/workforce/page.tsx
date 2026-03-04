'use client';

import { Button } from '@/components/ui/Button';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { FilterChips } from '@/components/filters/FilterChips';
import { DateRangePicker } from '@/components/filters/DateRangePicker';
import { DepartmentSelect } from '@/components/filters/DepartmentSelect';
import { useFilterStore } from '@/stores/filterStore';
import { useFilterState } from '@/hooks/useFilterState';

const workforceDepartments = [
  { id: 'dev', name: '개발본부', headcount: 420 },
  { id: 'sales', name: '영업본부', headcount: 280 },
  { id: 'marketing', name: '마케팅본부', headcount: 180 },
  { id: 'support', name: '경영지원', headcount: 165 },
  { id: 'design', name: '디자인센터', headcount: 95 },
  { id: 'planning', name: '기획실', headcount: 107 },
];

export default function WorkforcePage() {
  const { dateRange, setDateRange, departments, setDepartments, resetFilters } =
    useFilterStore();
  const { activeFilters, removeFilter } = useFilterState();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">인력 운영</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            인력 구조, 이동 및 효율 분석
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            리포트 다운로드
          </Button>
          <Button size="sm">
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            인력 현황표
          </Button>
        </div>
      </div>

      <FilterPanel onReset={resetFilters}>
        <DateRangePicker
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={(start, end) => setDateRange(start, end)}
        />
        <DepartmentSelect
          departments={workforceDepartments}
          value={departments}
          onChange={setDepartments}
        />
      </FilterPanel>

      {activeFilters.length > 0 && (
        <FilterChips filters={activeFilters} onRemove={removeFilter} />
      )}
    </div>
  );
}
