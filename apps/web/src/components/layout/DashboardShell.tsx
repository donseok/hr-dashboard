'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useViewStore } from '@/stores/viewStore';
import { cn } from '@/lib/cn';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const sidebarState = useViewStore((s) => s.sidebarState);
  const isCollapsed = sidebarState === 'collapsed';

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-[#0F172A]">
      <Sidebar />
      <div className={cn('flex flex-1 flex-col overflow-hidden transition-all duration-200')}>
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
