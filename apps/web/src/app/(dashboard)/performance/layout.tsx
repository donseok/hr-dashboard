import type { ReactNode } from 'react';

export default function PerformanceLayout({
  children,
  main,
  kpi,
  insights,
}: {
  children: ReactNode;
  main: ReactNode;
  kpi: ReactNode;
  insights: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {children}
      <div>{kpi}</div>
      <div className="grid grid-cols-1 desktop:grid-cols-3 gap-6">
        <div className="desktop:col-span-2 space-y-6">{main}</div>
        <div className="space-y-6">{insights}</div>
      </div>
    </div>
  );
}
