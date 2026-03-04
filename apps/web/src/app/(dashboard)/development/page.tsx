'use client';

import { Button } from '@/components/ui/Button';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { FilterChips } from '@/components/filters/FilterChips';
import { DateRangePicker } from '@/components/filters/DateRangePicker';
import { DepartmentSelect } from '@/components/filters/DepartmentSelect';
import { useFilterStore } from '@/stores/filterStore';
import { useFilterState } from '@/hooks/useFilterState';

const developmentDepartments = [
  { id: 'dev', name: '개발본부', headcount: 420 },
  { id: 'sales', name: '영업본부', headcount: 280 },
  { id: 'marketing', name: '마케팅본부', headcount: 180 },
  { id: 'support', name: '경영지원', headcount: 165 },
  { id: 'design', name: '디자인센터', headcount: 95 },
  { id: 'planning', name: '기획실', headcount: 107 },
];

export default function DevelopmentPage() {
  const { dateRange, setDateRange, departments, setDepartments, resetFilters } =
    useFilterStore();
  const { activeFilters, removeFilter } = useFilterState();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">육성 / 개발</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            교육, 역량 개발 및 내부 이동 분석
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            교육 등록
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
          departments={developmentDepartments}
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
