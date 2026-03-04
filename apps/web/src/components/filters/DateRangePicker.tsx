'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  className?: string;
}

const presets = [
  { label: '최근 7일', days: 7 },
  { label: '최근 30일', days: 30 },
  { label: '최근 90일', days: 90 },
  { label: '최근 1년', days: 365 },
];

export function DateRangePicker({ startDate, endDate, onChange, className }: DateRangePickerProps) {
  const [showPresets, setShowPresets] = useState(false);

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    setShowPresets(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">기간</label>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
          className="w-36 text-xs"
        />
        <span className="text-neutral-400 text-xs">~</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
          className="w-36 text-xs"
        />
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="text-xs"
          >
            빠른 선택
          </Button>
          {showPresets && (
            <div className="absolute right-0 top-full mt-1 z-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-md p-1 min-w-[120px]">
              {presets.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => applyPreset(preset.days)}
                  className="block w-full text-left px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-sm"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
