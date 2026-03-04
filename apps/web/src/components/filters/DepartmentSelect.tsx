'use client';

import { cn } from '@/lib/cn';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/Select';

interface DepartmentSelectProps {
  value: string[];
  onChange: (departments: string[]) => void;
  departments?: Array<{ id: string; name: string; headcount?: number }>;
  className?: string;
}

const defaultDepartments = [
  { id: 'engineering', name: '개발', headcount: 120 },
  { id: 'product', name: '기획', headcount: 45 },
  { id: 'design', name: '디자인', headcount: 30 },
  { id: 'marketing', name: '마케팅', headcount: 35 },
  { id: 'sales', name: '영업', headcount: 60 },
  { id: 'hr', name: '인사', headcount: 15 },
  { id: 'finance', name: '재무', headcount: 20 },
  { id: 'operations', name: '운영', headcount: 25 },
];

export function DepartmentSelect({
  value,
  onChange,
  departments = defaultDepartments,
  className,
}: DepartmentSelectProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">부서</label>
      <Select
        value={value[0] || ''}
        onValueChange={(v) => {
          if (v === 'all') {
            onChange([]);
          } else if (value.includes(v)) {
            onChange(value.filter((d) => d !== v));
          } else {
            onChange([...value, v]);
          }
        }}
      >
        <SelectTrigger className="w-40 text-xs">
          <SelectValue placeholder="전체 부서">
            {value.length === 0
              ? '전체 부서'
              : value.length === 1
                ? departments.find((d) => d.id === value[0])?.name || value[0]
                : `${value.length}개 부서`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 부서</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
              {dept.headcount !== undefined && (
                <span className="ml-2 text-neutral-400">({dept.headcount}명)</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
