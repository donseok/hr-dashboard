'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { ChartContainer } from '../ChartContainer';
import { colors } from '@hr-dashboard/design-tokens';

export interface CohortRow {
  cohort: string;
  values: number[];
}

export interface CohortHeatmapProps {
  title: string;
  subtitle?: string;
  data: CohortRow[];
  periodLabels: string[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  valueFormatter?: (value: number) => string;
  colorRange?: [string, string];
  onDataClick?: (cohort: string, period: string, value: number) => void;
  className?: string;
}

export function CohortHeatmap({
  title,
  subtitle,
  data,
  periodLabels,
  height = 400,
  isLoading = false,
  error = null,
  valueFormatter = (v) => `${v.toFixed(0)}%`,
  colorRange = ['#FEE2E2', colors.signal.success],
  onDataClick,
  className,
}: CohortHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const width = containerRef.current.clientWidth;
    const margin = { top: 30, right: 20, bottom: 10, left: 90 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const cellH = Math.min(30, innerH / data.length);
    const cellW = Math.min(60, innerW / periodLabels.length);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const allValues = data.flatMap((r) => r.values);
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    const colorScale = d3.scaleLinear<string>()
      .domain([minVal, maxVal])
      .range(colorRange);

    // Column headers
    periodLabels.forEach((label, i) => {
      g.append('text')
        .attr('x', i * cellW + cellW / 2)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', colors.neutral[500])
        .text(label);
    });

    // Rows
    data.forEach((row, ri) => {
      // Row label
      g.append('text')
        .attr('x', -8)
        .attr('y', ri * cellH + cellH / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 11)
        .attr('fill', colors.neutral[600])
        .text(row.cohort);

      // Cells
      row.values.forEach((val, ci) => {
        const x = ci * cellW;
        const y = ri * cellH;

        g.append('rect')
          .attr('x', x + 1)
          .attr('y', y + 1)
          .attr('width', cellW - 2)
          .attr('height', cellH - 2)
          .attr('fill', colorScale(val))
          .attr('rx', 3)
          .style('cursor', onDataClick ? 'pointer' : 'default')
          .on('click', () => {
            if (onDataClick) onDataClick(row.cohort, periodLabels[ci], val);
          })
          .on('mouseover', function () {
            d3.select(this).attr('stroke', colors.neutral[600]).attr('stroke-width', 2);
          })
          .on('mouseout', function () {
            d3.select(this).attr('stroke', 'none');
          });

        // Value text
        if (cellW > 30 && cellH > 18) {
          const textColor = val > (minVal + maxVal) / 2 ? '#fff' : colors.neutral[700];
          g.append('text')
            .attr('x', x + cellW / 2)
            .attr('y', y + cellH / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', 10)
            .attr('font-weight', 500)
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('fill', textColor)
            .attr('pointer-events', 'none')
            .text(valueFormatter(val));
        }
      });
    });
  }, [data, periodLabels, height, valueFormatter, colorRange, onDataClick]);

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
      isEmpty={data.length === 0}
      className={className}
    >
      <div ref={containerRef} style={{ width: '100%', height }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </ChartContainer>
  );
}
