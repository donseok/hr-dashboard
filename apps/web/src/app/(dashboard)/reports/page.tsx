'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

const mockReports = [
  { id: '1', name: '월간 인력 현황 리포트', type: '정기', lastGenerated: '2025-06-01', status: 'ready' },
  { id: '2', name: '분기별 이직 분석', type: '정기', lastGenerated: '2025-06-01', status: 'ready' },
  { id: '3', name: '채용 효율 분석', type: '수시', lastGenerated: '2025-05-28', status: 'ready' },
  { id: '4', name: 'DEI 현황 리포트', type: '정기', lastGenerated: '2025-05-15', status: 'generating' },
  { id: '5', name: '교육 ROI 분석', type: '수시', lastGenerated: '2025-05-10', status: 'ready' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">리포트</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">리포트 생성 및 관리</p>
        </div>
        <Button>새 리포트 생성</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>리포트 목록</CardTitle>
          <CardDescription>생성된 리포트를 확인하고 다운로드할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>리포트명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>최종 생성일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant={report.type === '정기' ? 'default' : 'secondary'}>
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                    {report.lastGenerated}
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'ready' ? 'success' : 'warning'}>
                      {report.status === 'ready' ? '완료' : '생성 중'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={report.status !== 'ready'}>
                      다운로드
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
