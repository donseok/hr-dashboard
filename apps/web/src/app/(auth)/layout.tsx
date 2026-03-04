import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-[#0F172A]">
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
