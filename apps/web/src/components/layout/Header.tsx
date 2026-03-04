'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

export function Header() {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700">
      <GlobalSearch />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
      title={theme === 'light' ? '라이트 모드' : theme === 'dark' ? '다크 모드' : '시스템 설정'}
    >
      {resolvedTheme === 'dark' ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      )}
    </button>
  );
}

function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="검색... (⌘K)"
          className="pl-9 pr-12 h-9 bg-neutral-50 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-600"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden tablet:inline-flex h-5 items-center gap-1 rounded border border-neutral-200 bg-white dark:bg-neutral-700 dark:border-neutral-600 px-1.5 text-[10px] font-medium text-neutral-400">
          ⌘K
        </kbd>
      </div>
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg z-50 p-2">
          <p className="px-3 py-6 text-sm text-neutral-400 dark:text-neutral-500 text-center">
            &quot;{query}&quot; 검색 결과가 없습니다
          </p>
        </div>
      )}
    </div>
  );
}

function NotificationBell() {
  const { unreadCount, notifications, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <svg className="h-5 w-5 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-signal-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">알림</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                모두 읽음
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-3 py-8 text-sm text-neutral-400 dark:text-neutral-500 text-center">
                새 알림이 없습니다
              </p>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'px-3 py-2.5 border-b border-neutral-50 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer',
                    !n.isRead && 'bg-primary-50/50 dark:bg-primary-900/20',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Badge variant={n.type === 'error' ? 'danger' : n.type === 'warning' ? 'warning' : 'default'} className="mt-0.5 text-[10px]">
                      {n.type}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">{n.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <Avatar className="h-8 w-8">
          {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg z-50 py-1">
          {user && (
            <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-700">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
            </div>
          )}
          <div className="py-1">
            <button className="w-full text-left px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              프로필
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              설정
            </button>
          </div>
          <div className="border-t border-neutral-100 dark:border-neutral-700 py-1">
            <button
              onClick={logout}
              className="w-full text-left px-3 py-1.5 text-sm text-signal-danger hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
