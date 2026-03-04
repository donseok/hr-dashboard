'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { useTheme } from '@/providers/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">설정</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">대시보드 환경설정</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="display">표시</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
              <CardDescription>기본 설정을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="default-period" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">기본 기간</label>
                <Select defaultValue="1year">
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">최근 30일</SelectItem>
                    <SelectItem value="90days">최근 90일</SelectItem>
                    <SelectItem value="6months">최근 6개월</SelectItem>
                    <SelectItem value="1year">최근 1년</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="refresh-interval" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">데이터 새로고침 간격</label>
                <Select defaultValue="5min">
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">실시간</SelectItem>
                    <SelectItem value="1min">1분</SelectItem>
                    <SelectItem value="5min">5분</SelectItem>
                    <SelectItem value="15min">15분</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 수신 조건을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">알림 설정 영역</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>표시 설정</CardTitle>
              <CardDescription>대시보드 표시 방식을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="theme-select" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">테마</label>
                <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}>
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">라이트</SelectItem>
                    <SelectItem value="dark">다크</SelectItem>
                    <SelectItem value="system">시스템</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  시스템 설정을 선택하면 OS 테마에 따라 자동으로 변경됩니다
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
