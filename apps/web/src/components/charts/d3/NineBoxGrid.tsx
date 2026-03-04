'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { ChartContainer } from '../ChartContainer';
import { colors } from '@hr-dashboard/design-tokens';

export interface NineBoxEmployee {
  id: string;
  name: string;
  performance: number; // 1-3 (low, medium, high)
  potential: number;   // 1-3 (low, medium, high)
  department?: string;
  avatarUrl?: string;
}

export interface NineBoxGridProps {
  title: string;
  subtitle?: string;
  employees: NineBoxEmployee[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (employee: NineBoxEmployee) => void;
  className?: string;
}

const BOX_LABELS = [
  ['Rough Diamond', 'Future Star', 'Consistent Star'],
  ['Inconsistent Player', 'Key Player', 'Current Star'],
  ['Talent Risk', 'Average Performer', 'Solid Performer'],
];

const BOX_COLORS = [
  ['#FEF3C7', '#DCFCE7', '#BBF7D0'],
  ['#FEE2E2', '#EFF6FF', '#DBEAFE'],
  ['#FEE2E2', '#FEF3C7', '#EFF6FF'],
];

export function NineBoxGrid({
  title,
  subtitle,
  employees,
  height = 450,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: NineBoxGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const cellW = innerW / 3;
    const cellH = innerH / 3;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw grid cells
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = col * cellW;
        const y = row * cellH;

        g.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellW)
          .attr('height', cellH)
          .attr('fill', BOX_COLORS[row][col])
          .attr('stroke', colors.neutral[200])
          .attr('stroke-width', 1)
          .attr('rx', 4);

        // Count employees in this cell
        const perf = col + 1;
        const pot = 3 - row;
        const count = employees.filter((e) => e.performance === perf && e.potential === pot).length;

        g.append('text')
          .attr('x', x + cellW / 2)
          .attr('y', y + 16)
          .attr('text-anchor', 'middle')
          .attr('font-size', 9)
          .attr('font-weight', 500)
          .attr('fill', colors.neutral[500])
          .text(BOX_LABELS[row][col]);

        if (count > 0) {
          g.append('text')
            .attr('x', x + cellW / 2)
            .attr('y', y + cellH / 2 + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', 22)
            .attr('font-weight', 700)
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('fill', colors.neutral[700])
            .text(count);

          g.append('text')
            .attr('x', x + cellW / 2)
            .attr('y', y + cellH / 2 + 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', 10)
            .attr('fill', colors.neutral[400])
            .text('명');
        }

        // Clickable overlay
        if (onDataClick && count > 0) {
          g.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', cellW)
            .attr('height', cellH)
            .attr('fill', 'transparent')
            .style('cursor', 'pointer')
            .on('click', () => {
              const emps = employees.filter((e) => e.performance === perf && e.potential === pot);
              if (emps[0]) onDataClick(emps[0]);
            })
            .on('mouseover', function () {
              d3.select(this.previousSibling as any).transition().attr('font-size', 26);
            })
            .on('mouseout', function () {
              d3.select(this.previousSibling as any).transition().attr('font-size', 22);
            });
        }
      }
    }

    // Axes labels
    const perfLabels = ['Low', 'Medium', 'High'];
    const potLabels = ['High', 'Medium', 'Low'];

    // X axis (Performance)
    perfLabels.forEach((label, i) => {
      g.append('text')
        .attr('x', i * cellW + cellW / 2)
        .attr('y', innerH + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('fill', colors.neutral[500])
        .text(label);
    });
    g.append('text')
      .attr('x', innerW / 2)
      .attr('y', innerH + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', colors.neutral[600])
      .text('Performance →');

    // Y axis (Potential)
    potLabels.forEach((label, i) => {
      g.append('text')
        .attr('x', -10)
        .attr('y', i * cellH + cellH / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 11)
        .attr('fill', colors.neutral[500])
        .text(label);
    });
    g.append('text')
      .attr('transform', `translate(-45, ${innerH / 2}) rotate(-90)`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', colors.neutral[600])
      .text('Potential →');
  }, [employees, height, onDataClick]);

  useEffect(() => {
    draw();
    const observer = new ResizeObserver(draw);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={employees.length === 0}
      className={className}
    >
      <div ref={containerRef} style={{ width: '100%', height }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </ChartContainer>
  );
}
